// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type AuthToken = {
    _id?: string;
    email?: string;
    role?: "buyer" | "seller" | "admin" | string;
    isVerified?: boolean;
    username?: string; // optional
    buyerProfile?: { username?: string } | string | null;
    [k: string]: any;
};

// const PROTECTED_ROUTES = ["/:username", "/admin", "/seller"];
// const PUBLIC_ROUTES = ["/login", "/sign-up", "/verify-account", "/"];

const PUBLIC_PREFIXES = ["/login", "/sign-up", "/verify-account", "/forgot-passoword", "/reset-password"];
const PUBLIC_ROOTS = ["/"]; // root is public


const isPublicPath = (pathname: string) => {
    if (PUBLIC_ROOTS.includes(pathname)) {
        return true;
    }
    if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        return true;
    }
    return false;
};

const extractTokenUsername = (token: AuthToken | null): (string | null) => {
    if (!token) {
        return null;
    }
    if (typeof token.username === "string" && token.username.length) {
        return token.username;
    }
    const buyerProfile = token.buyerProfile;
    if (buyerProfile && typeof buyerProfile === "object" && typeof (buyerProfile as any).username === "string") {
        return (buyerProfile as any).username;
    }
    if (typeof buyerProfile === "string" && buyerProfile.length) {
        return buyerProfile;
    }
    return null;
};

export const proxy = async (req: NextRequest) => {
    const token = (await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })) as AuthToken | null;
    const pathname = req.nextUrl.pathname;

    // allow internal runtime & static assets
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
            // not logged in => allow public
            return NextResponse.next();
        }

        // logged in users: if not verified, send to verify page (unless already there)
        const tokenUsername = extractTokenUsername(token);
        if (!token.isVerified) {
            if (!pathname.startsWith("/verify-account")) {
                return NextResponse.redirect(new URL(`/verify-account/${tokenUsername ?? ""}`, req.url));
            }
            return NextResponse.next();
        }

        // logged in & verified -> redirect from login/signup to user's proper place
        // If buyer -> /:username ; seller/admin -> /:username/:role/dashboard
        if (token.role === "buyer") {
            const username = tokenUsername ?? "";
            // if already at their username, allow; else redirect to it
            if (pathname === `/${username}`) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL(`/${username}`, req.url));
        }
        else if (token.role === "seller" || token.role === "admin") {
            return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
        }
        else {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protected Routes
    // if (!token) {
    //     return NextResponse.redirect(new URL("/login", req.url));
    //     // return NextResponse.next();
    // }

    if (!token) {
        // Instead of redirecting unknown routes to login, show not-found
        if (!/^\/(login|sign-up|verify-account|forgot-password|reset-password)/.test(pathname)) {
            return NextResponse.rewrite(new URL("/not-found", req.url));
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const tokenUsername = extractTokenUsername(token);
    if (!token.isVerified) {
        if (!pathname.startsWith("/verify-account")) {
            return NextResponse.redirect(new URL(`/verify-account/${tokenUsername ?? ""}`, req.url));
        }
        return NextResponse.next();
    }

    // Split path segments
    const segments = pathname.split("/").filter(Boolean); // ["alice","seller","dashboard"] or ["seller","list"]
    // Case A: single-segment path -> buyer home (/:username)
    if (segments.length === 1) {
        const [maybeUsername] = segments;

        // allow only if logged-in buyer whose username matches
        if (token.role !== "buyer") {
            // redirect to appropriate place for the logged-in user
            if (token.role === "seller" || token.role === "admin") {
                return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
            }
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (tokenUsername !== maybeUsername) {
            // prevent visiting other buyers' pages: redirect to own buyer home
            return NextResponse.redirect(new URL(`/${tokenUsername}`, req.url));
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
                    return NextResponse.redirect(new URL(`/${tokenUsername}`, req.url));
                }
                return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
            }
            if (tokenUsername !== first) {
                // username mismatch
                return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
            }
            return NextResponse.next();
        }

        // pattern: /seller/... or /admin/... (top-level role routes)
        if (first === "seller" || first === "admin") {
            if (token.role !== first) {
                if (token.role === "buyer") {
                    return NextResponse.redirect(new URL(`/${tokenUsername}`, req.url));
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
        "/",
        "/verify-account/:path*",
        "/:username",
        "/:username/:role/:path*",
        "/:role/:path*",
        "/((?!_next|api|static|favicon.ico|images).*)",
    ]
};