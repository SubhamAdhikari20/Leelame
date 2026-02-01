// src/components/common/breadcrumb-context.tsx
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import type { CurrentUser } from "@/types/current-user.type.ts";


type BreadcrumbProviderProps = {
    children: React.ReactNode;
    currentUser?: CurrentUser | null;
};

export type Crumb = { label: string; href?: string };
type BreadcrumbContextValue = {
    setOverride: (crumbs: Crumb[] | null) => void;
    crumbs: Crumb[];
};
const BreadcrumbContext = React.createContext<BreadcrumbContextValue | null>(null);

const prettifySegment = (seg: string) => {
    seg = decodeURIComponent(seg);
    // remove empty
    seg = seg.replace(/[-_]+/g, " ");
    if (!seg) {
        return "";

    }
    const lowered = seg.toLowerCase();
    if (lowered === "idx" || lowered === "index") {
        return "Home";

    }
    // common friendly names
    const map: Record<string, string> = {
        dashboard: "Dashboard",
        settings: "Settings",
        account: "Account",
        seller: "Seller",
        admin: "Admin",
    };
    if (map[lowered]) {
        return map[lowered];
    }

    // capitlize words
    return seg
        .split(" ")
        .map((s) => (s.length ? s[0].toUpperCase() + s.slice(1) : ""))
        .join(" ");
};

// export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    export const BreadcrumbProvider = ({ children, currentUser }: BreadcrumbProviderProps) => {
    const pathname = usePathname();
    const currentUserRole = currentUser?.role.toLowerCase();
    const [override, setOverride] = React.useState<Crumb[] | null>(null);

    const role = React.useMemo(() => {
        if (pathname) {
            const parts = pathname.split("/").filter(Boolean);
            if (parts.length > 0) {
                const first = parts[0].toLowerCase();
                if (first === "seller" || first === "admin") {
                    return first;
                }
            }
        }
        return currentUserRole || "seller";
    }, [pathname, currentUserRole]);

    // compute default crumbs from current pathname
    const defaultCrumbs = React.useMemo(() => {
        if (!pathname) {
            return [{ label: "Home", href: "/" }];
        }
        const basePath = `/${role}`;
        const homeHref = `${basePath}/dashboard`;
        const homeLabel = "Home";
        const dashboardLabel = "Dashboard";

        const parts = pathname.split("/").filter(Boolean);
        if (parts.length === 0 || parts[0] !== role) {
            return [{ label: homeLabel, href: homeHref }];
        }

        const subParts = parts.slice(1);
        const isHome = subParts.length === 0 || (subParts.length === 1 && subParts[0].toLowerCase() === "dashboard");

        let crumbs: Crumb[];
        if (isHome) {
            crumbs = [{ label: dashboardLabel }];
        } else {
            crumbs = [{ label: homeLabel, href: homeHref }];
            let accum = basePath;
            let startIndex = 0;
            // If path starts with /role/dashboard/... skip 'dashboard' in crumbs for nested under dashboard
            if (subParts.length > 1 && subParts[0].toLowerCase() === "dashboard") {
                startIndex = 1;
                accum += "/dashboard";
            }
            for (let i = startIndex; i < subParts.length; i++) {
                const part = subParts[i];
                accum += `/${part}`;
                crumbs.push({
                    label: prettifySegment(part),
                    href: accum,
                });
            }
        }

        return crumbs;
    }, [pathname, role]);

    const crumbs = override && override.length > 0 ? override : defaultCrumbs;

    const value = React.useMemo(
        () => ({
            setOverride,
            crumbs,
        }),
        [crumbs]
    );

    return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
};

export const useBreadcrumbContext = () => {
    const ctx = React.useContext(BreadcrumbContext);
    if (!ctx) {
        throw new Error("useBreadcrumbContext must be used inside a BreadcrumbProvider");
    }
    return ctx;
};