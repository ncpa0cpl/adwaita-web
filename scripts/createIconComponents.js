var fs = require("fs");
var path = require("path");

const SVG_DIR = path.resolve(__dirname, "../src/assets/icons");
const TARGET_DIR = path.resolve(__dirname, "../src/components/icons");

const renameDefinitions = {};

function createComponentName(fileName) {
  let componentName = fileName
    .replace("-symbolic", "")
    .replace(".svg", "")
    .replace(/(^\w|-\w)/g, (text) => {
      return text.replace(/-/, "").toUpperCase();
    });
  if (renameDefinitions[componentName]) return renameDefinitions[componentName];
  return componentName;
}

function createIconComponent(file, componentName) {
  return `import React from "react";
import cx from 'clsx';
import { ReactComponent as ${componentName}Symbolic } from '../../assets/icons/${file}';

function ${componentName}({ className, colored, ...rest }) {
  return (
    <span className={cx("Icon", className, { colored })} {...rest}>
      {React.createElement(${componentName}Symbolic)}
    </span>
  );
}

export default ${componentName};`;
}

function saveIconComponent(component, componentName) {
  if (!fs.existsSync(TARGET_DIR))
    fs.mkdir(TARGET_DIR, (err) => {
      if (err) return console.log(err);
    });
  fs.writeFile(
    path.join(TARGET_DIR, `${componentName}.js`),
    component,
    (err) => {
      if (err) {
        return console.log(err);
      }
    }
  );
}

async function run() {
  fs.readdir(SVG_DIR, (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      let componentName = createComponentName(file);
      let component = createIconComponent(file, componentName);
      saveIconComponent(component, componentName);
    });
  });
}

run();
