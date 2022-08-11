import fs from "fs/promises";
import path from "path";
import validate from "semver/functions/valid";
import glob from "tiny-glob";

function getFirstCommandLineArgument() {
  const arg = process.argv[2];
  if (arg && validate(arg)) {
    return arg;
  }
  return "latest";
}

function getExampleWrapper(projectRoot: string) {
  const wrapperPath = path.resolve(projectRoot, "docs/example-wrapper.jsx");
  return fs.readFile(wrapperPath, "utf8");
}

async function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const examplesDir = path.resolve(projectRoot, "docs/examples");
  const bundleLocation = path.resolve(projectRoot, "docs/examples.json");

  const exampleFiles = await glob(path.join(examplesDir, "*.md"));

  const version = getFirstCommandLineArgument();

  const bundle: Record<string, string> = {};

  for (const filepath of exampleFiles) {
    const filename = path.parse(filepath).name;
    let file = await fs.readFile(filepath, "utf8");

    if (version) {
      file = file.replace(
        /```(tsx|jsx|js|ts)\n/g,
        `\`\`\`$1\n// adwaita-web@${version}\n`
      );
    }

    bundle[filename] = file;
  }

  await fs.writeFile(
    bundleLocation,
    JSON.stringify(
      {
        wrapper: await getExampleWrapper(projectRoot),
        components: bundle,
      },
      null,
      2
    )
  );
}

main();
