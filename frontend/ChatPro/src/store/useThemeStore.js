import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem("bg-theme") || "forest",
    setTheme : (theme) => {
        set({theme})
        localStorage.setItem("bg-theme",theme)
    }
}));