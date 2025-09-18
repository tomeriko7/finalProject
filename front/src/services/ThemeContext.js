import React, { createContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export const ThemeContext = createContext();

// יצירת קונפיגורציית קאש לתמיכה ב-RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  const toggleMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", nextMode);
      return nextMode;
    });
  };

const theme = useMemo( 
  () =>
    createTheme({
      // הגדרת כיוון ה-RTL
      direction: 'rtl',
      palette: {
        mode,
        primary: {
          main: "rgb(25, 115, 96)",
        },
        background: {
          default: mode === "dark" ? "#1c1c1c" : "#fafafa",
          paper: mode === "dark" ? "#2a2a2a" : "#ffffff",
        },
      },
      typography: {
        fontFamily: '"Assistant", sans-serif',
        
      },
      custom: {
        navbar: mode === "dark" ? "#1c1c1c" : "rgba(117, 117, 117, 0.1)",
      },
    }),
  [mode]
);


  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};
