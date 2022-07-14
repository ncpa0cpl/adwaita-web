import fs from "fs/promises";
import path from "path";
import glob from "tiny-glob";
import { getPool } from "./worker";

const execParse = (
  root: string,
  entryPoint: string,
  tsConfigPath: string
): Promise<[string, object]> => {
  return getPool().exec("getComponentTypeDocs", [
    root,
    entryPoint,
    tsConfigPath,
  ]) as any;
};

async function main() {
  console.log("Generating Type Docs");

  try {
    const componentFiles = await glob("./src/components/*.{ts,tsx,svg}");

    const componentTypeDocs = await Promise.all(
      componentFiles.map(async (f) => {
        const reflection = await execParse(
          process.cwd(),
          path.resolve(process.cwd(), f),
          path.resolve(process.cwd(), "./tsconfig.build.json")
        );

        return reflection;
      })
    );

    await fs.writeFile(
      "./docs/typedocs.json",
      JSON.stringify({ components: Object.fromEntries(componentTypeDocs) }, null, 2)
    );
    getPool().terminate();
  } catch (e) {
    getPool().terminate();
    console.error(e);
    return process.exit(1);
  }
}

main();
