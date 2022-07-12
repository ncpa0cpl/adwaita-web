import stylesDark from "./adwaita-dark.scss";
import stylesLight from "./adwaita.scss";

const currentStyles = {
  theme: null as "light" | "dark" | null,
  styleNode: null as HTMLStyleElement | null,
};

export class Adwaita {
  static currentTheme() {
    return currentStyles.theme as "light" | "dark";
  }

  static changeToLightTheme() {
    if (currentStyles.theme === "light") return;

    if (currentStyles.styleNode) {
      currentStyles.styleNode.textContent = stylesLight;
      currentStyles.theme = "light";
    }
  }

  static changeToDarkTheme() {
    if (currentStyles.theme === "dark") return;

    if (currentStyles.styleNode) {
      currentStyles.styleNode.textContent = stylesDark;
      currentStyles.theme = "dark";
    }
  }
}

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.type = "text/css";
  document.head.appendChild(styleEl);

  Adwaita.changeToLightTheme();
}
