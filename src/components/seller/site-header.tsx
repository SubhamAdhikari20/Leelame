// src/components/seller/site-header.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { SidebarTrigger } from "@/components/ui/sidebar.tsx"


const SellerSiteHeader = () => {
    return (
        <header className="sticky top-0 inset-x-0 z-20 bg-white dark:bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <nav className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Documents</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <a
                            href="https://github.com/SubhamAdhikari20/Leelame"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            GitHub
                        </a>
                    </Button>
                </div>
            </nav>
        </header>
    );
};

export default SellerSiteHeader;