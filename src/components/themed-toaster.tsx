// src/components/shared/themed-toaster.tsx
"use client";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useTheme } from "@/app/context/theme-provider.tsx";

const ThemedToaster = () => {
    const { theme } = useTheme();
    const resolvedTheme =
        theme === "system"
            ? (typeof window !== "undefined" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light")
            : theme;

    return (
        <Toaster
            richColors
            closeButton
            theme={resolvedTheme}
        />
    );
};

export default ThemedToaster;