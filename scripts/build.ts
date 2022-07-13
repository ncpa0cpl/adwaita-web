import { build } from "esbuild";
import svgr from "esbuild-plugin-svgr";
import { sassPlugin } from "esbuild-sass-plugin";
import glob from "tiny-glob";
import { replaceImports } from "./esbuild-import-replace";
import { svgReactTemplate } from "./svgr-icon-template";

async function buildScss() {
  const files = await glob("./src/adwaita/adwaita*.{scss}");

  await build({
    entryPoints: files,
    plugins: [
      sassPlugin({
        type: "css-text",
        style: "compressed",
      }),
    ],
    outdir: "./dist/adwaita",
    target: "es2020",
    format: "esm",
  });
}

async function main() {
  buildScss();

  const files = await glob("./src/**/*.{ts,tsx,svg}");

  build({
    entryPoints: files,
    plugins: [
      svgr({
        memo: true,
        template: svgReactTemplate,
      }),
      replaceImports({
        replaceMap: [
          [/.+\.(scss|sass)$/i, (path) => path.replace(/\.scss$/, ".js")],
          [/.+\.(svg)$/i, (path) => path.replace(/\.svg$/, ".js")],
        ],
      }),
    ],
    bundle: false,
    outdir: "./dist",
    target: "es2022",
    jsx: "transform",
    loader: {
      ".js": "jsx",
    },
    minify: false,
    tsconfig: "./tsconfig.json",
    format: "esm",
  });
}

main();
