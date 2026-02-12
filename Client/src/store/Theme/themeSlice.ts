import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
    darkMode: boolean;
}

const getInitialTheme = (): boolean => {
    if (localStorage.getItem("theme") === "dark") return true;
    return false;
};

const initialState: ThemeState = {
    darkMode: getInitialTheme()
};
const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;

            if (state.darkMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        },
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;

            if (state.darkMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        }
    }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;