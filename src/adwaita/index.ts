// import stylesDark from "./adwaita-dark.scss";
// import stylesLight from "./adwaita.scss";

import mainStylesheet from "./adwaita.scss";
import darkThemeVars from "./dark-color-variables.scss";
import lightThemeVars from "./light-color-variables.scss";

const currentStyles = {
  theme: null as "light" | "dark" | null,
  stylesheet: null as HTMLStyleElement | null,
  variables: null as HTMLStyleElement | null,
};

export class Adwaita {
  static currentTheme() {
    return currentStyles.theme as "light" | "dark";
  }

  static changeToLightTheme() {
    if (currentStyles.theme === "light") return;

    if (currentStyles.variables) {
      currentStyles.variables.textContent = lightThemeVars;
      currentStyles.theme = "light";
    }
  }

  static changeToDarkTheme() {
    if (currentStyles.theme === "dark") return;

    if (currentStyles.variables) {
      currentStyles.variables.textContent = darkThemeVars;
      currentStyles.theme = "dark";
    }
  }

  static getVariables() {
    const varsStylesheet =
      currentStyles.theme === "light" ? lightThemeVars : darkThemeVars;

    const varsList = varsStylesheet
      .replace(/^.*:root\s*{/, "")
      .replace(/}\s*$/, "")
      .trim()
      .split(";")
      .map((line) => line.trim());

    const varsMap = new Map(
      varsList
        .map((line) => line.split(":"))
        .filter((splitLine): splitLine is [string, string] => splitLine.length === 2)
    );

    return varsMap;
  }
}

if (typeof document !== "undefined") {
  const themeVariablesElem = document.createElement("style");
  currentStyles.variables = themeVariablesElem;
  document.head.appendChild(themeVariablesElem);

  const stylesheetElem = document.createElement("style");
  currentStyles.stylesheet = stylesheetElem;
  document.head.appendChild(stylesheetElem);

  stylesheetElem.textContent = mainStylesheet;

  Adwaita.changeToLightTheme();
}
