import { build } from "esbuild";
import svgr from "esbuild-plugin-svgr";
import { sassPlugin } from "esbuild-sass-plugin";

build({
  entryPoints: ["./src/index.js"],
  plugins: [
    svgr(),
    sassPlugin({
      type: "css-text",
      style: "compressed",
    }),
  ],
  bundle: true,
  outdir: "./dist",
  target: "es2020",
  jsx: "transform",
  loader: {
    ".js": "jsx",
  },
  minify: true,
  treeShaking: false,
  tsconfig: "./tsconfig.json",
  format: "esm",
});
