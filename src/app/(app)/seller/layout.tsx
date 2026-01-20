// src/app/(app)/seller/layout.tsx
"use client";
import React from "react";
import SellerSidebar from "@/components/seller/sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { BreadcrumbProvider } from "@/components/common/breadcrumb-context.tsx";
import SiteHeader from "@/components/common/site-header.tsx";
import SiteFooter from "@/components/common/site-footer.tsx";


const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <BreadcrumbProvider>
                <SellerSidebar />
                <div className="min-h-screen flex-1">
                    <SiteHeader />
                    <main className="min-h-[90vh] bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                        {children}
                    </main>
                    <SiteFooter />
                </div>
            </BreadcrumbProvider>
        </SidebarProvider>
    );
};

export default AppLayout;