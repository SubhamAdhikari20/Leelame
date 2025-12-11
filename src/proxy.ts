// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type AuthToken = {
    _id: string;
    email: string;
    role: "buyer" | "seller" | "admin" | string;
    isVerified?: boolean;
    username?: string | null;
    buyerProfile?: string | null;
    sellerProfile?: string | null;
    adminProfile?: string | null;
    [k: string]: any;
};

const PUBLIC_PATHS = [
    "/login",
    "/sign-up",
    "/verify-account",
    "/forgot-password",
    "/reset-password",
    // "/blog",
    // "/about",
    // "/contact",
    // "/products",
    // "/become-seller"
];
const PUBLIC_ROOTS = ["/"];

const AUTH_ENTRY_PATHS = ["/", "/login", "/sign-up", "/forgot-password", "/reset-password"];

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

export async function proxy(req: NextRequest) {
    const token = (await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })) as AuthToken | null;
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
        if (!token) {
            return NextResponse.next();
            // return NextResponse.rewrite(new URL("/not-found", req.url));
        }

        if (!token.isVerified) {
            if (
                pathname.startsWith("/verify-account/registration") ||
                pathname.startsWith("/verify-account/reset-password")
            ) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL(`/verify-account/registration/${token.username}`, req.url));
        }

        if (isAuthEntryPath(pathname)) {
            if (token.role === "buyer") {
                if (pathname === `/${token.username}`) {
                    return NextResponse.next();
                }
                return NextResponse.redirect(new URL(`/${token.username}`, req.url));
            }
            if (token.role === "seller" || token.role === "admin") {
                return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
            }
        }

        return NextResponse.rewrite(new URL("/not-found", req.url));
        // return NextResponse.next();
        // return NextResponse.redirect(new URL("/", req.url));
    }

    // Protected Routes
    if (!token) {
        // Instead of redirecting unknown routes to login, show not-found
        // if (!/^\/(login|sign-up|verify-account|forgot-password|reset-password)/.test(pathname)) {
        //     return NextResponse.rewrite(new URL("/not-found", req.url));
        // }
        // return NextResponse.next();
        return NextResponse.rewrite(new URL("/not-found", req.url));
        // return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!token.isVerified) {
        if (
            pathname.startsWith("/verify-account/registration") ||
            pathname.startsWith("/verify-account/reset-password")
        ) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL(`/verify-account/registration/${token.username}`, req.url));
    }

    // Split path segments
    const segments = pathname.split("/").filter(Boolean); // ["alice","seller","dashboard"] or ["seller","list"]
    if (segments.length === 1) {
        const [username] = segments;

        // allow only if logged-in buyer whose username matches
        if (token.role !== "buyer") {
            // redirect to appropriate place for the logged-in user
            if (token.role === "seller" || token.role === "admin") {
                return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
            }
            // return NextResponse.redirect(new URL("/", req.url));
            return NextResponse.rewrite(new URL("/not-found", req.url));
        }

        if (token.username !== username) {
            // prevent visiting other buyers' pages: redirect to own buyer home
            return NextResponse.redirect(new URL(`/${token.username}`, req.url));
            // return NextResponse.rewrite(new URL("/not-found", req.url));
        }
        return NextResponse.next();
    }

    // Case B: path with at least 2 segments
    if (segments.length >= 2) {
        const [first, second] = segments;

        // pattern: /:username/seller/... or /:username/admin/...
        if (second === "seller" || second === "admin") {
            // must match both username and role
            if (token.role !== second) {
                // not the correct role; redirect to logged-in user's place
                if (token.role === "buyer") {
                    // return NextResponse.redirect(new URL(`/${tokenUsername}`, req.url));
                    return NextResponse.rewrite(new URL("/not-found", req.url));
                }
                // return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
            if (token.username !== first) {
                // username mismatch
                // return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
            return NextResponse.next();
        }

        // pattern: /seller/... or /admin/... (top-level role routes)
        if (first === "seller" || first === "admin") {
            if (token.role !== first) {
                if (token.role === "buyer") {
                    // return NextResponse.redirect(new URL(`/${tokenUsername}`, req.url));
                    return NextResponse.rewrite(new URL("/not-found", req.url));
                }
                return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
            }
            return NextResponse.next();
        }
    }

    // otherwise allow
    return NextResponse.rewrite(new URL("/not-found", req.url));
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
}