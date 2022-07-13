import type { Plugin } from "esbuild";
import fs from "fs/promises";
import path from "path";

const resolveReplacer = (
  replacer: string | ((old: string) => string),
  old: string
) => {
  if (typeof replacer === "string") {
    return replacer;
  }
  return replacer(old);
};

export const replaceImports = (options: {
  replaceMap: [
    pattern: RegExp | string,
    replaceWith: string | ((old: string) => string)
  ][];
}): Plugin => {
  return {
    name: "esbuild-import-replacer",
    setup(build) {
      build.onLoad(
        { filter: /.*\.(ts|tsx|js|jsx)$/ },
        async ({ path: filePath }) => {
          const p = path.parse(filePath);

          const content = await fs.readFile(filePath, "utf8");

          const lines = content.split("\n");

          for (const index of lines.keys()) {
            const line = lines[index]!;

            if (line.match(/^(import.+)|(export.+from.+)/)) {
              const importPath = line.match(/^(import|export).+?["'](.+?)["']/);
              if (importPath && importPath[2]) {
                const path = importPath[2];

                for (const [pattern, replaceWith] of options.replaceMap) {
                  if (path.match(pattern)) {
                    const newPath = resolveReplacer(replaceWith, path);
                    lines.splice(
                      index,
                      1,
                      line.replace(
                        /^(import.+?["']|export.+?["'])(.+)(["'].+)$/,
                        `$1${newPath}$3`
                      )
                    );
                  }
                }
              }
            }
          }

          return {
            contents: lines.join("\n"),
            loader: p.ext === ".tsx" ? "tsx" : p.ext === ".jsx" ? "jsx" : "ts",
          };
        }
      );
    },
  };
};
