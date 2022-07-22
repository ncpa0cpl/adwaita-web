import fs from "fs/promises";
import type { JSONSchema4, JSONSchema4Type, JSONSchema4TypeName } from "json-schema";
import path from "path";
import { Application, JSONOutput, TSConfigReader } from "typedoc";
import { TYPE_MAP } from "./external-packages-type-map";

function getComment(commentSection?: JSONOutput.Comment) {
  if (!commentSection) return "";

  let text = [];

  for (const line of commentSection.shortText?.split("\n") ?? []) {
    text.push(line);
  }
  for (const line of commentSection.text?.split("\n") ?? []) {
    text.push(line);
  }

  return text.join("\n");
}

function getSchemaTypeNameFor(value: any): JSONSchema4TypeName {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  throw new Error(`Unsupported type ${typeof value}`);
}

function traverseAndFind(
  allChildren: JSONOutput.DeclarationReflection[],
  id: number
):
  | JSONOutput.TypeParameterReflection
  | JSONOutput.DeclarationReflection
  | undefined {
  for (const child of allChildren) {
    if (child.id === id) return child;
    for (const tp of child.typeParameter ?? []) {
      if (tp.id === id) return tp;
    }
    const found = traverseAndFind(child.children ?? [], id);
    if (found) return found;
  }
  return undefined;
}

function parseMethod(
  methodReflection: JSONOutput.DeclarationReflection,
  allChildren: JSONOutput.DeclarationReflection[],
  description?: string,
  defaultValue?: any
): JSONSchema4 {
  const callSignature = methodReflection.signatures?.find(
    (s) => s.kindString === "Call signature"
  );

  if (callSignature) {
    return {
      default: defaultValue,
      title: "Function",
      type: "object",
      description,
      properties: {
        arguments: {
          type: "object",
          additionalProperties: false,
          properties: Object.fromEntries(
            callSignature.parameters?.map((p, i) => [
              i.toString(),
              p.type
                ? {
                    title: p.name,
                    ...parseTypeKindToSchema(
                      p.type as JSONOutput.SomeType,
                      allChildren
                    ),
                  }
                : { title: p.name, type: "any" },
            ]) ?? []
          ),
        },
        returns: callSignature.type
          ? parseTypeKindToSchema(callSignature.type, allChildren)
          : { type: "null" },
      },
      additionalProperties: false,
      required: ["arguments", "returns"],
    };
  }

  throw new Error(
    `Could not find call signature for method ${methodReflection.name}`
  );
}

function isFunctionType(typeKind: JSONOutput.SomeType) {
  return (
    typeKind.type === "reflection" &&
    typeKind.declaration?.signatures?.some((s) => s.kindString === "Call signature")
  );
}

function extractPropertyNames(schema: JSONSchema4): JSONSchema4 {
  if (schema.type === "object") {
    return {
      type: "string",
      enum: Object.keys(schema.properties ?? {}),
    };
  }
  if (schema.oneOf) {
    return {
      oneOf: schema.oneOf.map(extractPropertyNames),
    };
  }
  if (schema.allOf) {
    return {
      allOf: schema.allOf.map(extractPropertyNames),
    };
  }
  return { type: "string" };
}

function parseTypeKindToSchema(
  typeKind: JSONOutput.SomeType,
  allChildren: JSONOutput.DeclarationReflection[],
  description?: string,
  defaultValue?: JSONSchema4Type,
  typeOf?: JSONOutput.DeclarationReflection | JSONOutput.TypeParameterReflection
): JSONSchema4 {
  switch (typeKind.type) {
    case "array":
      return {
        default: defaultValue,
        description,
        type: "array",
        items: parseTypeKindToSchema(typeKind.elementType, allChildren),
      };
    case "reflection": {
      const description = typeKind.declaration?.comment
        ? getComment(typeKind.declaration.comment)
        : "";

      if (isFunctionType(typeKind)) {
        return parseMethod(
          typeKind.declaration!,
          allChildren,
          description,
          defaultValue
        );
      }

      return {
        default: defaultValue,
        type: "object",
        description,
        properties: Object.fromEntries(
          typeKind.declaration?.children?.map((c) => [
            c.name,
            c.type
              ? parseTypeKindToSchema(
                  c.type as JSONOutput.SomeType,
                  allChildren,
                  getComment(c.comment),
                  undefined,
                  c
                )
              : c.kindString === "Method"
              ? parseMethod(
                  c,
                  allChildren,
                  c.comment ? getComment(c.comment) : "",
                  c.defaultValue
                )
              : ({
                  type: "any",
                  description,
                  title: "Type for this property could not be resolved.",
                } as const),
          ]) ?? []
        ),
        required:
          typeKind.declaration?.children
            ?.filter((c) => !c.flags.isOptional)
            ?.map((c) => c.name) ?? [],
      };
    }
    case "intersection":
      return {
        default: defaultValue,
        description,
        allOf: typeKind.types.map((t) => parseTypeKindToSchema(t, allChildren)),
      };
    case "intrinsic":
      return {
        default: defaultValue,
        description,
        type: typeKind.name as JSONSchema4TypeName,
      };
    case "reference": {
      if ("id" in typeKind && !!typeKind.id) {
        const referencedChild = traverseAndFind(allChildren, typeKind.id);
        if (!referencedChild) {
          throw new Error(
            `Could not find referenced child with id ${(typeKind as any).id}`
          );
        }
        if (!("type" in referencedChild) || !referencedChild.type) {
          return {
            default: defaultValue,
            description,
            type: "any",
          };
        }
        return parseTypeKindToSchema(
          referencedChild.type as JSONOutput.SomeType,
          allChildren,
          getComment(referencedChild.comment),
          defaultValue,
          referencedChild
        );
      } else if (typeKind.name === "ExtendElementProps") {
        const actualType = typeKind.typeArguments![1];
        return parseTypeKindToSchema(
          actualType!,
          allChildren,
          description,
          defaultValue
        );
      } else if (typeKind.name === "React.PropsWithChildren") {
        const actualType = typeKind.typeArguments![0];
        return parseTypeKindToSchema(
          actualType!,
          allChildren,
          description,
          defaultValue
        );
      } else if (typeKind.package) {
        const metadata = {
          title: typeKind.name,
          description: `External Type from '${typeKind.package}'.`,
        };

        if (TYPE_MAP.has(typeKind.name)) {
          const schema = {
            ...TYPE_MAP.get(typeKind.name)!,
            default: defaultValue,
            metadata,
          };

          if (description)
            if (schema.description) {
              schema.description = `${schema.description}\n\n${description}`;
            } else {
              schema.description = description;
            }

          return schema;
        }

        const schema = {
          description,
          default: defaultValue,
          metadata,
        };

        return schema;
      } else {
        throw new Error(`Unsupported reference type ${typeKind.name}`);
      }
    }
    case "union":
      return {
        default: defaultValue,
        description,
        oneOf: typeKind.types.map((t) =>
          parseTypeKindToSchema(t as JSONOutput.SomeType, allChildren)
        ),
      };
    case "literal":
      return {
        default: defaultValue,
        description,
        type: getSchemaTypeNameFor(typeKind.value),
        enum: [typeKind.value],
      };
    case "tuple":
      return {
        default: defaultValue,
        description,
        type: "array",
        items: typeKind.elements?.map((e) =>
          parseTypeKindToSchema(e, allChildren)
        ) ?? { type: "any" },
      };
    case "typeOperator": {
      const targetTypeSchema = parseTypeKindToSchema(
        typeKind.target,
        allChildren,
        description,
        defaultValue
      );

      if (typeKind.operator === "keyof") {
        return {
          default: defaultValue,
          description,
          ...extractPropertyNames(targetTypeSchema),
        };
      }

      return targetTypeSchema;
    }
    case "query":
      return parseTypeKindToSchema(
        typeKind.queryType,
        allChildren,
        description,
        defaultValue
      );
    case "unknown":
      return {
        default: defaultValue,
        description,
        type: "any",
      };
    default:
      throw new Error(`Unsupported type kind ${typeKind.type}`);
  }
}

function parseImplementation(implementation: JSONOutput.DeclarationReflection) {
  return {
    comment: implementation.comment ? getComment(implementation.comment) : "",
    sources: implementation.sources,
  };
}

function parseProps(
  props: JSONOutput.DeclarationReflection,
  allChildren: JSONOutput.DeclarationReflection[]
) {
  if (!props.type) {
    throw new Error(`Props is not defined.`);
  }

  const schema: JSONSchema4 = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    ...parseTypeKindToSchema(
      props.type as JSONOutput.SomeType,
      allChildren,
      undefined,
      undefined,
      props
    ),
  };

  return {
    sources: props.sources,
    propsSchema: schema,
  };
}

function extractStandardChildrens(
  name: string,
  children: JSONOutput.DeclarationReflection[]
): {
  implementation: JSONOutput.DeclarationReflection;
  props: JSONOutput.DeclarationReflection;
} {
  const implementation = children.find((c) => c.name === `${name}`);
  const props = children.find((c) => c.name === `${name}Props`);

  if (!implementation || !props) {
    throw new Error(
      `Could not find implementation and/or props for [${name}] Component.`
    );
  }

  return {
    implementation,
    props,
  };
}

function mapReflection(
  name: string,
  packagedReflection: JSONOutput.ContainerReflection
) {
  const { implementation, props } = extractStandardChildrens(
    name,
    packagedReflection.children ?? []
  );

  const { comment: componentDescription, sources: componentSources } =
    parseImplementation(implementation);

  const { propsSchema, sources: propsSources } = parseProps(
    props,
    packagedReflection.children ?? []
  );

  return [
    name,
    {
      description: componentDescription,
      propsSchema,
      propsSources,
      componentSources,
    },
  ];
}

export async function getComponentTypeDocs(
  rootAbs: string,
  entryPoint: string,
  tsConfigPath: string
) {
  try {
    const componentFile = path.parse(entryPoint);

    console.log(
      `Parsing "${componentFile.name}", at: "${path.relative(
        process.cwd(),
        entryPoint
      )}"`
    );

    const parser = new Application();

    parser.options.addReader(new TSConfigReader());

    parser.bootstrap({
      entryPoints: [entryPoint, path.resolve(rootAbs, "./src/icons.ts")],
      tsconfig: tsConfigPath,
      excludeExternals: false,
      excludeInternal: false,
      excludeNotDocumented: false,
      excludePrivate: false,
      excludeProtected: false,
      entryPointStrategy: "Resolve",
    });

    const component = parser.convert();

    if (!component) {
      console.error(new Error(`Failed to parse component ${entryPoint}`));
      process.exit(1);
    }

    const jsonFilePath = path.resolve(
      rootAbs,
      `./docs/tmp/${componentFile.name}.json`
    );

    await parser.generateJson(component, jsonFilePath);

    const containerReflection: JSONOutput.ContainerReflection = JSON.parse(
      await fs.readFile(jsonFilePath, "utf8")
    );

    const reflection = {
      ...containerReflection,
      children: containerReflection.children?.flatMap((c) => c.children),
    } as JSONOutput.ContainerReflection;

    return mapReflection(componentFile.name, reflection);
  } catch (e) {
    console.error(
      `An error occured when parsing: ${entryPoint}\n${(e as Error).message}`
    );
    throw e;
  }
}
