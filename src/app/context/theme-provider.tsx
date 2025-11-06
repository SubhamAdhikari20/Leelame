// frontend/src/context/theme-provider.tsx
"use client";
import React, { createContext, useEffect, useState, useContext, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("system");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
            setTheme(savedTheme);
        }
        else {
            setTheme("system");
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const applyTheme = () => {
            const resolvedTheme =
                theme === "system"
                    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
                    : theme;
            root.classList.toggle("dark", resolvedTheme === "dark");
        };
        applyTheme();

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQuery.addEventListener("change", applyTheme);
            return () => mediaQuery.removeEventListener("change", applyTheme);
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === "light") return "dark";
            if (prev === "dark") return "system";
            return "light";
        });

    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};