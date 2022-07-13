import { Application, TSConfigReader } from "typedoc";
import workerpool from "workerpool";

function getComponentTypeDocs(entryPoint, tsConfigPath) {
  const parser = new Application();

  parser.options.addReader(new TSConfigReader());

  parser.bootstrap({
    entryPoints: [entryPoint],
    tsconfig: tsConfigPath,
  });

  const component = parser.convert();

  if (!component) {
    console.error(new Error(`Failed to parse component ${entryPoint}`));
    process.exit(1);
  }

  return component.toObject(parser.serializer);
}

workerpool.worker({ getComponentTypeDocs });
