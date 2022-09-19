import { Box, Button, HeaderBar, InputGroup, ThemeProvider } from "adwaita-web";
import React from "react";

const ThemeToggler = ({ children }) => {
  const [theme, setTheme] = React.useState("light");

  return (
    <ThemeProvider theme={theme}>
      <Box
        vertical
        className="background"
        style={{ overflow: "scroll", height: "100vh" }}
      >
        <HeaderBar titlebar>
          <Box fill horizontal justify="center" align="center">
            <InputGroup>
              <Button active={theme === "light"} onClick={() => setTheme("light")}>
                Light Theme
              </Button>
              <Button active={theme === "dark"} onClick={() => setTheme("dark")}>
                Dark Theme
              </Button>
            </InputGroup>
          </Box>
        </HeaderBar>
        <Box fill vertical justify align style={{ marginTop: 10, marginBottom: 10 }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ThemeToggler;
