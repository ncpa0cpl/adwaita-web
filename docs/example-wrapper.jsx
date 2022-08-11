import { Box, Button, HeaderBar, InputGroup, ThemeProvider } from "adwaita-web";
import React from "react";
import "./index.css";

const ThemeToggler = ({ children }) => {
  const [theme, setTheme] = React.useState("light");

  return (
    <ThemeProvider theme={theme}>
      <Box fill vertical className="background">
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
        <Box fill vertical style={{ marginTop: 20 }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ThemeToggler;
