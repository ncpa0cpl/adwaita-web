import type { JSONSchema4, JSONSchema4Type, JSONSchema4TypeName } from "json-schema";
import path from "path";
import { Application, JSONOutput, TSConfigReader } from "typedoc";

function getComment(commentSection?: JSONOutput.Comment) {
  if (!commentSection) return "";

  let text = [];

  for (const summary of commentSection.summary) {
    if (summary.kind === "code") text.push(`<code>${summary.text}</code>`);
    else text.push(summary.text);
  }

  return text.join("");
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
    for (const tp of child.typeParameters ?? []) {
      if (tp.id === id) return tp;
    }
    const found = traverseAndFind(child.children ?? [], id);
    if (found) return found;
  }
  return undefined;
}

function parseTypeKindToSchema(
  typeKind: JSONOutput.SomeType,
  allChildren: JSONOutput.DeclarationReflection[],
  description?: string,
  defaultValue?: JSONSchema4Type
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

      const callSignature = typeKind.declaration?.signatures?.find(
        (s) => s.kindString === "Call signature"
      );

      if (callSignature) {
        return {
          default: defaultValue,
          title: "Function",
          type: "object",
          description,
          properties: {
            arguments: Object.fromEntries(
              callSignature.parameters?.map((p, i) => [
                i.toString(),
                p.type
                  ? { title: p.name, ...parseTypeKindToSchema(p.type, allChildren) }
                  : { title: p.name, type: "any" },
              ]) ?? []
            ),
            returns: callSignature.type
              ? parseTypeKindToSchema(callSignature.type, allChildren)
              : { type: "null" },
            properties: {
              type: "object",
              properties: Object.fromEntries(
                typeKind.declaration?.children?.map((c) => [
                  c.name,
                  c.type
                    ? parseTypeKindToSchema(
                        c.type,
                        allChildren,
                        getComment(c.comment)
                      )
                    : ({ type: "any" } as const),
                ]) ?? []
              ),
              required:
                typeKind.declaration?.children
                  ?.filter((c) => !c.flags.isOptional)
                  ?.map((c) => c.name) ?? [],
            },
          },
          required: ["arguments", "returns"],
        };
      }
      return {
        default: defaultValue,
        type: "object",
        description,
        properties: Object.fromEntries(
          typeKind.declaration?.children?.map((c) => [
            c.name,
            c.type
              ? parseTypeKindToSchema(c.type, allChildren, getComment(c.comment))
              : ({ type: "any" } as const),
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
          referencedChild.type,
          allChildren,
          getComment(referencedChild.comment),
          defaultValue
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
        return {
          title: `External Type (package: ${typeKind.package}, name: ${typeKind.name})`,
          default: defaultValue,
          type: "any",
          description,
        };
      } else {
        throw new Error(`Unsupported reference type ${typeKind.name}`);
      }
    }
    case "union":
      return {
        default: defaultValue,
        description,
        oneOf: typeKind.types.map((t) => parseTypeKindToSchema(t, allChildren)),
      };
    case "literal":
      return {
        default: defaultValue,
        description,
        type: getSchemaTypeNameFor(typeKind.value),
        enum: [typeKind.value],
      };
    case "named-tuple-member":
      return {
        default: defaultValue,
        description,
        type: "array",
        items: parseTypeKindToSchema(typeKind.element, allChildren),
      };
    case "template-literal":
      return {
        default: defaultValue,
        description,
        type: "string",
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
    case "typeOperator":
      return parseTypeKindToSchema(
        typeKind.target,
        allChildren,
        description,
        defaultValue
      );
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
  const comments =
    implementation.signatures
      ?.map((s) => s.comment)
      .filter((c): c is JSONOutput.Comment => !!c) ?? [];

  let text = "";

  for (const comment of comments) {
    text += getComment(comment);
  }

  return {
    comment: text,
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
    ...parseTypeKindToSchema(props.type, allChildren),
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
  const implementation = children.find((c) => c.name === `${name}Impl`);
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

export function getComponentTypeDocs(
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

    const r = component.toObject(parser.serializer);

    const reflection = {
      ...r,
      children: r.children?.flatMap((c) => c.children),
    } as JSONOutput.ContainerReflection;

    return mapReflection(componentFile.name, reflection);
  } catch (e) {
    console.error(
      `An error occured when parsing: ${entryPoint}\n${(e as Error).message}`
    );
    throw e;
  }
}
