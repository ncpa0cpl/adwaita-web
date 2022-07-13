import fs from "fs/promises";
import path from "path";
import glob from "tiny-glob";
import { ContainerReflection } from "typedoc";
import workerpool from "workerpool";

const pool = workerpool.pool(__dirname + "/parse-component.js");

const execParse = (
  entryPoint: string,
  tsConfigPath: string
): Promise<ContainerReflection> => {
  return pool.exec("getComponentTypeDocs", [entryPoint, tsConfigPath]) as any;
};

async function main() {
  const componentFiles = await glob("./src/components/*.{ts,tsx,svg}");

  const componentTypeDocs = await Promise.all(
    componentFiles.map(async (f) => {
      const name = path.parse(f).name;
      const reflection = await execParse(
        path.resolve(process.cwd(), f),
        path.resolve(process.cwd(), "./tsconfig.build.json")
      );

      return [
        name,
        reflection.children?.map((c) => {
          const groups =
            reflection.groups?.filter((g) =>
              (g.children as any as number[])?.includes(c.id)
            ) ?? [];
          return { ...c, groups: groups.map((g) => g.title) };
        }),
      ];
    })
  );

  await fs.writeFile(
    "./docs/typedocs.json",
    JSON.stringify({ components: Object.fromEntries(componentTypeDocs) }, null, 2)
  );
}

main();
