// src/components/ThemeToggle.tsx
import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useThemeSelector } from "../../store/hooks";
import { setTheme, toggleTheme } from "../../store/Theme/themeSlice";

const ThemeToggle: React.FC = () => {
    const darkMode = useThemeSelector((state) => state.theme.darkMode);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Initialize theme from localStorage on mount
        if (localStorage.getItem("theme") === "dark") {
            dispatch(setTheme(true));
        } else {
            dispatch(setTheme(false));
        }
    }, [dispatch]);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-1 cursor-pointer hover:bg-slate-500 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0e0430]' : 'bg-indigo-600'}`}
        >
            {!darkMode ? (
                <Sun className="h-6 w-6 text-yellow-300" />
            ) : (
                <Moon className="h-6 w-6 text-blue-700" />
            )}
        </button>
    );
};

export default ThemeToggle;