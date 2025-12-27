// src/app/(auth)/(buyer)/layout.tsx
import React from "react";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <main className="bg-size-[20px_20px] min-h-[90vh] bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default AppLayout;