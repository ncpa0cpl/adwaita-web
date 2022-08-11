import React from "react";
import { Adwaita } from "../adwaita";

const themeContext = React.createContext({
  isDefault: true,
  theme: "light" as "light" | "dark",
  variablesMap: new Map<string, string>(),
});

export type ThemeProviderProps = React.PropsWithChildren<{
  theme: "light" | "dark";
}>;

export const ThemeProvider = (props: ThemeProviderProps) => {
  const ctx = React.useContext(themeContext);
  if (!ctx.isDefault) return <>{props.children}</>;

  const [theme, setTheme] = React.useState(props.theme);
  const [variablesMap, setVariablesMap] = React.useState(new Map<string, string>());

  React.useEffect(() => {
    switch (props.theme) {
      case "light":
        Adwaita.changeToLightTheme();
        break;
      case "dark":
        Adwaita.changeToDarkTheme();
        break;
    }

    setTheme(props.theme);
    setVariablesMap(Adwaita.getVariables());
  }, [props.theme]);

  return (
    <themeContext.Provider value={{ isDefault: false, variablesMap, theme }}>
      <div
        className={theme === "dark" ? "adwaita-dark-theme" : "adwaita-light-theme"}
        style={{ display: "contents" }}
      >
        {props.children}
      </div>
    </themeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = React.useContext(themeContext);

  return {
    theme: ctx.theme,
    variables: ctx.variablesMap,
  };
};
