// src/app/(auth)/layout.tsx
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className="bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {children}
            </main>
        </>
    );
};

export default AppLayout;