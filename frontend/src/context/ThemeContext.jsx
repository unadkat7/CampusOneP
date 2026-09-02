import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme] = useState("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("campusone_theme", "dark");
  }, []);

  const toggleTheme = () => {
    // Permanent dark mode enforced
  };

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
