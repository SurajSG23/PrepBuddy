import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ✅ Context type
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// ✅ Create context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// ✅ Provider component
export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);

    // If nothing saved, check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  // ✅ Sync with system preference if user changes OS theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
      localStorage.setItem("darkMode", JSON.stringify(e.matches));
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// ✅ Hook to use dark mode
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
