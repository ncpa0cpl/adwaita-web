import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

class VariableFile {
  static async open(filePath: string): Promise<VariableFile> {
    const content = await fs.readFile(filePath, "utf8");
    return new VariableFile(filePath, content);
  }

  private constructor(private filePath: string, private content: string) {}

  get variables(): [string, string][] {
    const lines = this.content.split("\n");

    const variables: [string, string][] = lines
      .filter((line) => line.match(/^\s*--.+:\s+.+$/))
      .map((line) => {
        const [varName, varValue] = line.split(":").map((s) => s.trim());
        if (!varName || !varValue) {
          throw new Error(`Invalid variable definition: ${line}`);
        }
        return [varName, varValue];
      });

    return variables;
  }

  delete(varName: string) {
    this.content = this.content
      .split("\n")
      .filter((line) => !line.includes(varName))
      .join("\n");
  }

  async save() {
    await fs.writeFile(this.filePath, this.content, { encoding: "utf-8" });
  }
}

const root = path.resolve(__dirname, "..");

async function main() {
  console.log(chalk.greenBright("Optimizing CSS variables...\n"));

  const cssDir = path.resolve(root, "dist/adwaita");

  const css: string = require(path.resolve(cssDir, "adwaita.js")).default;

  const variables = {
    darkTheme: await VariableFile.open(
      path.resolve(cssDir, "dark-color-variables.js")
    ),
    lightTheme: await VariableFile.open(
      path.resolve(cssDir, "light-color-variables.js")
    ),
  };

  for (const [varName] of variables.lightTheme.variables) {
    if (!css.includes(varName)) {
      console.log(
        `Variable ${chalk.yellowBright(varName)} is not used, ${chalk.redBright(
          "removing"
        )}`
      );

      variables.lightTheme.delete(varName);
    }
  }

  for (const [varName] of variables.darkTheme.variables) {
    if (!css.includes(varName)) {
      variables.darkTheme.delete(varName);
    }
  }

  await Promise.all([variables.darkTheme.save(), variables.lightTheme.save()]);
}

main();
