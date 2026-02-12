// components/Custom/DarkModeContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<Ctx | null>(null);

function getInitialDark(): boolean {
  try {
    const v = localStorage.getItem("theme");
    if (v === "dark") return true;
    if (v === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  } catch {
    return false;
  }
}

function applyClass(dark: boolean) {
  const root = document.documentElement; // <html>
  root.classList.toggle("dark", dark);
}

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDark);

  useEffect(() => {
    applyClass(darkMode);
    try { localStorage.setItem("theme", darkMode ? "dark" : "light"); } catch {}
  }, [darkMode]);

  // keep in sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
        setDarkMode(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(() => ({
    darkMode,
    setDarkMode,
    toggleDarkMode: () => setDarkMode(d => !d),
  }), [darkMode]);

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
};

export function useDarkMode(): Ctx {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
