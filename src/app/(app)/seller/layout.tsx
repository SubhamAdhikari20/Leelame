// src/app/(app)/seller/layout.tsx
"use client";
import React from "react";
import SellerSidebar from "@/components/seller/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";


const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SellerSidebar />
            <main className="min-h-screen flex-1 bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {/* <SidebarTrigger /> */}
                {children}
            </main>
        </SidebarProvider>
    );
};

export default AppLayout;