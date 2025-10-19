// components/Custom/ThemeToggle.tsx
import React from "react";
import { useDarkMode } from "./DarkModeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const label = darkMode ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text)",
        cursor: "pointer"
      }}
    >
      <span>{darkMode ? "🌙" : "☀️"}</span>
      <span style={{ fontSize: 14 }}>{darkMode ? "Dark" : "Light"}</span>
    </button>
  );
}
