import crypto from "crypto";
import fs from "fs/promises";
import type { JSONSchema4, JSONSchema4Type, JSONSchema4TypeName } from "json-schema";
import path from "path";
import { Application, JSONOutput, TSConfigReader } from "typedoc";
import { TYPE_MAP } from "./external-packages-type-map";

function extract(obj: object, path: string) {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (typeof current === "object" && current !== null && part in current) {
      current = (current as Record<string, any>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function getStringUnionLiterals(schema: JSONSchema4): string[] {
  if (schema.type === "string") {
    if (!schema.enum) {
      throw new Error(`Expected enum to be defined for string union`);
    }
    return schema.enum.flatMap((member) => {
      if (typeof member === "string") {
        return member;
      }
      throw new Error(`Invalid enum member`);
    });
  } else if (schema.oneOf) {
    return schema.oneOf.flatMap(getStringUnionLiterals);
  }

  throw new Error(`Invalid string union`);
}

function removeAnyTypeElements(schema: JSONSchema4[]) {
  return schema.filter((s) => s.type !== "any");
}

function applyChangeToObjectSchema(
  schema: JSONSchema4,
  change: (schema: JSONSchema4) => void
): JSONSchema4 {
  if (schema.type === "object") {
    change(schema);
    return schema;
  }

  if (schema.oneOf) {
    return {
      ...schema,
      oneOf: schema.oneOf.map((s) => applyChangeToObjectSchema(s, change)),
    };
  }

  if (schema.allOf) {
    return {
      ...schema,
      allOf: schema.allOf.map((s) => applyChangeToObjectSchema(s, change)),
    };
  }

  throw new Error(`Invalid object schema`);
}

function getComment(
  schema: JSONSchema4 | JSONOutput.SomeType | JSONOutput.DeclarationReflection
) {
  const commentSection: JSONOutput.Comment | undefined =
    extract(schema, "comment") ??
    extract(schema, "declaration.comment") ??
    extract(schema, "signatures.0.comment");

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
  obj: object,
  id: number
):
  | JSONOutput.TypeParameterReflection
  | JSONOutput.DeclarationReflection
  | undefined {
  let childrenIterable = Array.isArray(obj) ? obj : Object.values(obj);
  let stop = false;

  while (!stop) {
    for (const child of childrenIterable) {
      if (child && typeof child === "object") {
        if (child.id === id && child.type !== "reference") return child;
      }
    }

    const childrenIterableCopy = childrenIterable;
    childrenIterable = [];

    for (const child of childrenIterableCopy) {
      if (child && typeof child === "object") {
        childrenIterable.push(
          ...(Array.isArray(child) ? child : Object.values(child))
        );
      }
    }

    if (childrenIterable.length === 0) {
      stop = true;
    }
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
      const desc = typeKind.declaration?.comment
        ? getComment(typeKind)
        : description;

      if (isFunctionType(typeKind)) {
        return parseMethod(typeKind.declaration!, allChildren, desc, defaultValue);
      }

      return {
        default: defaultValue,
        type: "object",
        description: desc,
        properties: Object.fromEntries(
          typeKind.declaration?.children?.map((c) => [
            c.name,
            c.type
              ? parseTypeKindToSchema(
                  c.type as JSONOutput.SomeType,
                  allChildren,
                  getComment(c),
                  undefined,
                  c
                )
              : c.kindString === "Method"
              ? parseMethod(c, allChildren, getComment(c), c.defaultValue)
              : ({
                  type: "any",
                  description: desc,
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
        allOf: removeAnyTypeElements(
          typeKind.types.map((t) => parseTypeKindToSchema(t, allChildren))
        ),
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
          getComment(referencedChild),
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
      } else if (typeKind.name === "Record" && typeKind.package === "typescript") {
        const [keysType, ValueType] = typeKind.typeArguments!;
        if (!keysType || !ValueType) {
          throw new Error(`Could not find type arguments for Record type`);
        }
        return {
          title: "Record",
          type: "object",
          description,
          default: defaultValue,
          additionalProperties: parseTypeKindToSchema(ValueType, allChildren),
          propertyNames: parseTypeKindToSchema(keysType, allChildren),
        };
      } else if (typeKind.name === "Array" && typeKind.package === "typescript") {
        const [elementType] = typeKind.typeArguments!;
        if (!elementType) {
          throw new Error(`Could not find type arguments for Array type`);
        }
        return {
          title: "Array",
          type: "array",
          description,
          default: defaultValue,
          items: parseTypeKindToSchema(elementType, allChildren),
        };
      } else if (typeKind.name === "Partial" && typeKind.package === "typescript") {
        const [elementType] = typeKind.typeArguments!;
        if (!elementType) {
          throw new Error(`Could not find type arguments for Partial type`);
        }

        const parsed = parseTypeKindToSchema(
          elementType,
          allChildren,
          description,
          defaultValue
        );

        applyChangeToObjectSchema(parsed, (schema) => {
          schema.required = false;
        });

        return parsed;
      } else if (typeKind.name === "Required" && typeKind.package === "typescript") {
        const [elementType] = typeKind.typeArguments!;
        if (!elementType) {
          throw new Error(`Could not find type arguments for Required type`);
        }

        const parsed = parseTypeKindToSchema(
          elementType,
          allChildren,
          description,
          defaultValue
        );

        applyChangeToObjectSchema(parsed, (schema) => {
          schema.required = Object.keys(schema.properties ?? {});
        });

        return parsed;
      } else if (typeKind.name === "Pick" && typeKind.package === "typescript") {
        const [originalType, pickedProperties] = typeKind.typeArguments!;
        if (!originalType || !pickedProperties) {
          throw new Error(`Could not find type arguments for Pick type`);
        }

        const parsedOriginalType = parseTypeKindToSchema(
          originalType,
          allChildren,
          description,
          defaultValue
        );

        const parsedPickedProperties = parseTypeKindToSchema(
          pickedProperties,
          allChildren
        );

        const propertiesToPick = getStringUnionLiterals(parsedPickedProperties);

        applyChangeToObjectSchema(parsedOriginalType, (schema) => {
          if (schema.properties) {
            const newProperties = Object.fromEntries(
              Object.entries(schema.properties).filter(([key]) =>
                propertiesToPick.includes(key)
              )
            );
            schema.properties = newProperties;
          }
          if (Array.isArray(schema.required)) {
            schema.required = schema.required.filter((key) =>
              propertiesToPick.includes(key)
            );
          }
        });

        return parsedOriginalType;
      } else if (typeKind.name === "Omit" && typeKind.package === "typescript") {
        const [originalType, excludedNames] = typeKind.typeArguments!;
        if (!originalType || !excludedNames) {
          throw new Error(`Could not find type arguments for Exclude type.`);
        }

        const parsedOriginalType = parseTypeKindToSchema(
          originalType,
          allChildren,
          description,
          defaultValue
        );

        const parsedExcludedNames = parseTypeKindToSchema(
          excludedNames,
          allChildren
        );

        const propertiesToRemove = getStringUnionLiterals(parsedExcludedNames);

        applyChangeToObjectSchema(parsedOriginalType, (schema) => {
          for (const propertyName of propertiesToRemove) {
            if (propertyName in schema.properties! ?? {})
              delete schema.properties![propertyName];

            if (Array.isArray(schema.required)) {
              schema.required = schema.required.filter((n) => n !== propertyName);
            }
          }
        });

        return parsedOriginalType;
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
        oneOf: removeAnyTypeElements(
          typeKind.types.map((t) =>
            parseTypeKindToSchema(t as JSONOutput.SomeType, allChildren)
          )
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
    case "conditional": {
      const { trueType, falseType } = typeKind;
      if (!trueType || !falseType) {
        throw new Error(`Could not find conditional type arguments`);
      }
      return {
        oneOf: [
          parseTypeKindToSchema(trueType, allChildren),
          parseTypeKindToSchema(falseType, allChildren),
        ],
      };
    }
    default:
      throw new Error("Unsupported type kind: " + typeKind.type);
  }
}

function parseImplementation(implementation: JSONOutput.DeclarationReflection) {
  return {
    comment: getComment(implementation),
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

function generateChecksumFromString(str: string): string {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

async function getFileChecksum(filePath: string): Promise<string> {
  const file = await fs.readFile(filePath, "utf-8");
  return generateChecksumFromString(file);
}

async function getCachedFileChecksum(filePath: string): Promise<string> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const obj = JSON.parse(fileContent);
    return obj.checksum ?? "";
  } catch (e) {
    return "";
  }
}

export async function getComponentTypeDocs(
  rootAbs: string,
  entryPoint: string,
  tsConfigPath: string
) {
  try {
    const componentFile = path.parse(entryPoint);
    const jsonFilePath = path.resolve(
      rootAbs,
      `./docs/tmp/${componentFile.name}.json`
    );

    console.log(
      `Parsing "${componentFile.name}", at: "${path.relative(
        process.cwd(),
        entryPoint
      )}"`
    );

    const checksum = await getFileChecksum(entryPoint);
    const cachedChecksum = await getCachedFileChecksum(jsonFilePath);

    if (checksum !== cachedChecksum) {
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

      await parser.generateJson(component, jsonFilePath);

      // add checksum to the file
      const generatedJson = await fs.readFile(jsonFilePath, "utf-8");
      const obj = JSON.parse(generatedJson);
      obj.checksum = checksum;
      await fs.writeFile(jsonFilePath, JSON.stringify(obj, null, 2));
    }

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
