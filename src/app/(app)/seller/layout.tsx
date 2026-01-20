// src/app/(app)/seller/layout.tsx
"use client";
import React from "react";
import SellerSidebar from "@/components/seller/sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";


const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SellerSidebar />
            <main className="min-h-screen flex-1 bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {children}
            </main>
        </SidebarProvider>
    );
};

export default AppLayout;