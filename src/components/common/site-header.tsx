// src/components/common/site-header.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { SidebarTrigger } from "@/components/ui/sidebar.tsx"
import { useBreadcrumbContext } from "@/components/common/breadcrumb-context.tsx";
import { useTheme } from "@/app/context/theme-provider.tsx";
import { SunIcon } from "lucide-react";
import { FaMoon } from "react-icons/fa";
import {
    NotificationFeedPopover,
    NotificationIconButton,
} from "@knocklabs/react";
import PortalWrapper from "@/components/wrappers/portal-wrapper.tsx";
import type { CurrentUserProps } from "@/types/current-user.type.ts";


const SiteHeader = ({ currentUser }: CurrentUserProps) => {
    const { crumbs } = useBreadcrumbContext();
    const { theme, toggleTheme } = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    const [feedOpen, setFeedOpen] = useState(false);
    const notifButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setResolvedTheme(prefersDark ? "dark" : "light");
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    const breadcrumbItems = crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
            <React.Fragment key={`${crumb.label}-${index}`}>
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage className="text-base font-medium">{crumb.label}</BreadcrumbPage>
                    ) : crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    ) : (
                        <BreadcrumbLink>{crumb.label}</BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
        );
    });

    return (
        <header className="sticky top-0 inset-x-0 z-20 bg-white dark:bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) min-h-[5vh]" role="banner">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <nav aria-label="Breadcrumb" className="min-w-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbItems}
                        </BreadcrumbList>
                    </Breadcrumb>
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    {/* {currentUser && (
                        <>
                            <NotificationIconButton
                                ref={notifButtonRef}
                                onClick={() => setFeedOpen((v) => !v)}
                            />
                            {feedOpen && (
                                <PortalWrapper>
                                    <NotificationFeedPopover
                                        buttonRef={notifButtonRef}
                                        isVisible={feedOpen}
                                        onClose={() => setFeedOpen(false)}
                                    />
                                </PortalWrapper>
                            )}
                        </>
                    )} */}

                    {/* Light/Dark Mode Button*/}
                    <Button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        size="sm"
                        className="inline-flex items-center gap-1 rounded-sm border text-gray-800 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 focus:ring-1 focus:ring-gray-300 transition-colors p-2"
                    >
                        {resolvedTheme === "dark" ? (
                            <SunIcon className="dark:text-gray-200 w-5 h-5" />
                        ) : (
                            <FaMoon className="dark:text-gray-200 w-5 h-5" />
                        )}
                    </Button>
                    {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <a
                            href="https://github.com/SubhamAdhikari20/Leelame"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            GitHub
                        </a>
                    </Button> */}
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;