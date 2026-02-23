// src/proxy.ts
import { NextResponse, NextRequest } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie.ts";

const PUBLIC_PATHS = [
    "/login",
    "/sign-up",
    "/verify-account",
    "/forgot-password",
    "/reset-password",
    "/blog",
    "/about",
    "/contact",
    "/products",
    "/become-seller",
    // "/admin/login",
    // "/admin/sign-up"
];
const PUBLIC_ROOTS = ["/"];

const AUTH_ENTRY_PATHS = [
    "/",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    // "/admin/login",
    // "/admin/sign-up"
];

const ADMIN_AUTH_PATHS = [
    "/admin/login",
    "/admin/sign-up",
    "/admin/forgot-password",
    "/admin/verify-account",
    "/admin/reset-password",
];

const isPublicPath = (pathname: string) => {
    if (PUBLIC_ROOTS.includes(pathname)) {
        return true;
    }
    if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        return true;
    }
    return false;
};

const isAuthEntryPath = (path: string) => {
    return AUTH_ENTRY_PATHS.includes(path) || AUTH_ENTRY_PATHS.some(p => path.startsWith(`${p}/`));
};

const isAdminAuthPath = (pathname: string) =>
    ADMIN_AUTH_PATHS.includes(pathname) ||
    ADMIN_AUTH_PATHS.some(p => pathname.startsWith(`${p}/`));

export async function proxy(req: NextRequest) {
    const authToken = await getAuthToken();
    const authUserData = await getUserData();
    const pathname = req.nextUrl.pathname;

    // allow internal runtime and static assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    // Public Routes
    if (isPublicPath(pathname)) {
        if (!authToken || !authUserData) {
            return NextResponse.next();
            // return NextResponse.rewrite(new URL("/not-found", req.url));
        }

        if (!authUserData.isVerified) {
            if (
                pathname.startsWith("/verify-account/registration") ||
                pathname.startsWith("/verify-account/reset-password")
            ) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL(`/verify-account/registration/${authUserData.username}`, req.url));
        }

        if (isAuthEntryPath(pathname)) {
            if (authUserData.role === "buyer") {
                if (pathname === `/${authUserData.username}`) {
                    return NextResponse.next();
                }
                return NextResponse.redirect(new URL(`/${authUserData.username}`, req.url));
            }
            if ((authUserData.role === "seller") || (authUserData.role === "admin")) {
                return NextResponse.redirect(new URL(`/${authUserData.role}/dashboard`, req.url));
            }
        }

        // return NextResponse.rewrite(new URL("/not-found", req.url));
        return NextResponse.next();
        // return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAdminAuthPath(pathname)) {
        if (!authToken || !authUserData) {
            return NextResponse.next();
        }

        // already logged in
        if (authUserData.role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        // logged in but not admin
        return NextResponse.rewrite(new URL("/not-found", req.url));
    }

    // Protected Routes
    if (!authToken || !authUserData) {
        // Instead of redirecting unknown routes to login, show not-found
        // if (!/^\/(login|sign-up|verify-account|forgot-password|reset-password)/.test(pathname)) {
        //     return NextResponse.rewrite(new URL("/not-found", req.url));
        // }
        // return NextResponse.next();
        return NextResponse.rewrite(new URL("/not-found", req.url));
        // return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!authUserData.isVerified) {
        if (
            pathname.startsWith("/verify-account/registration") ||
            pathname.startsWith("/verify-account/reset-password")
        ) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL(`/verify-account/registration/${authUserData.username}`, req.url));
    }

    // Split path segments
    const segments = pathname.split("/").filter(Boolean); // ["alice","seller","dashboard"] or ["seller","list"]
    if (segments.length === 1) {
        const [username] = segments;

        // allow only if logged-in buyer whose username matches
        if (authUserData.role !== "buyer") {
            // redirect to appropriate place for the logged-in user
            if ((authUserData.role === "seller") || (authUserData.role === "admin")) {
                return NextResponse.redirect(new URL(`/${authUserData.role}/dashboard`, req.url));
            }
            // return NextResponse.redirect(new URL("/", req.url));
            return NextResponse.rewrite(new URL("/not-found", req.url));
        }

        if (authUserData.username !== username) {
            // prevent visiting other buyers' pages: redirect to own buyer home
            return NextResponse.redirect(new URL(`/${authUserData.username}`, req.url));
            // return NextResponse.rewrite(new URL("/not-found", req.url));
        }
        return NextResponse.next();
    }

    // Case B: path with at least 2 segments
    if (segments.length >= 2) {
        const [first, second] = segments;

        if (authUserData.role === "buyer") {
            if (authUserData.username !== first) {
                return NextResponse.redirect(new URL(`/${authUserData.username}`, req.url));
            }
            return NextResponse.next();
        }

        // if (authUserData.username === first) {
        //     // You can add more granular checks here if needed, 
        //     // but this allows /Subham20/my-profile/...
        //     return NextResponse.next();
        // }

        if ((authUserData.role === "buyer") && (second === "buyer")) {
            if (authUserData.username !== first) {
                return NextResponse.redirect(new URL(`/${authUserData.username}`, req.url));
            }
            return NextResponse.next();
        }

        // pattern: /:username/seller/... or /:username/admin/...
        if (second === "seller" || second === "admin") {
            // must match both username and role
            if (authUserData.role !== second) {
                // not the correct role; redirect to logged-in user's place
                if (authUserData.role === "buyer") {
                    // return NextResponse.redirect(new URL(`/${authUserData.username}`, req.url));
                    return NextResponse.rewrite(new URL("/not-found", req.url));
                }
                // return NextResponse.redirect(new URL(`/${authUserData.role}/dashboard`, req.url));
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
            if (authUserData.username !== first) {
                // username mismatch
                // return NextResponse.redirect(new URL(`/${authUserData.role}/dashboard`, req.url));
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
            return NextResponse.next();
        }

        // pattern: /seller/... or /admin/... (top-level role routes)
        if (first === "seller" || first === "admin") {
            if (authUserData.role !== first) {
                if (authUserData.role === "buyer") {
                    // return NextResponse.redirect(new URL(`/${authUserData.username}`, req.url));
                    return NextResponse.rewrite(new URL("/not-found", req.url));
                }
                return NextResponse.redirect(new URL(`/${authUserData.role}/dashboard`, req.url));
                // return NextResponse.rewrite(new URL("/not-found", req.url));
            }
            return NextResponse.next();
        }
    }

    // otherwise allow
    return NextResponse.rewrite(new URL("/not-found", req.url));
    // return NextResponse.next();
};

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        // "/",
        // "/:path*",
        // "/verify-account/:path*",
        // "/:username",
        // // "/:username/:role/:path*",
        // "/:role/:path*",
        "/((?!_next|api|static|favicon.ico|images).*)",
    ]
};