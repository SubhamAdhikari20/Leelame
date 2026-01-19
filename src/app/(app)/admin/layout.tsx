// src/app/(app)/admin/layout.tsx
"use client";
import React from "react";
import AdminSidebar from "@/components/admin/sidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";


const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="min-h-screen flex-1 bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {children}
            </main>
        </SidebarProvider>
    );
};

export default AppLayout;