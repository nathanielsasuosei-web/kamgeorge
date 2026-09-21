"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const THEMES = [
  { id: "white", label: "White", swatch: "#faf9f7", dark: false },
  { id: "black", label: "Black", swatch: "#0a0a0a", dark: true },
  { id: "blue", label: "Blue", swatch: "#12275a", dark: true },
  { id: "red", label: "Red", swatch: "#4a1010", dark: true },
  { id: "pink", label: "Pink", swatch: "#f9d3e8", dark: false },
  { id: "green", label: "Green", swatch: "#0b3b2e", dark: true },
  { id: "gray", label: "Gray", swatch: "#e2e2e2", dark: false },
];

const ThemeContext = createContext(null);
const STORAGE_KEY = "kamgeorge-theme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("white");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) setThemeState(saved);
    } catch {
      // storage unavailable
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const dark = THEMES.find((t) => t.id === theme)?.dark;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme: setThemeState, themes: THEMES }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
