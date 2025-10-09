import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage or fallback to 'system'
    return localStorage.getItem("theme") || "system";
  });
  const [trueBlack, setTrueBlack] = useState(() => {
    return localStorage.getItem("trueBlack") === "true";
  });

  // Detect system theme
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  // Determine actual theme
  const currentTheme =
    theme === "system" ? getSystemTheme() : theme;

  // Apply immediately to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", theme);
  }, [theme, currentTheme]);

  // Apply true black if enabled
  useEffect(() => {
    localStorage.setItem("trueBlack", trueBlack);
    document.documentElement.setAttribute("data-true-black", trueBlack);
  }, [trueBlack]);

  // React to system theme change in real time
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          getSystemTheme()
        );
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, trueBlack, setTrueBlack, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
