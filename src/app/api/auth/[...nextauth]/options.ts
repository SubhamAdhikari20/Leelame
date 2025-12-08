// src/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/services/auth.service.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { SellerRepository } from "@/repositories/seller.repository.ts";
import { AdminRepository } from "@/repositories/admin.repository.ts";


type RawCredentials = {
    identifier?: string;
    password?: string;
    role?: "buyer" | "seller" | "admin" | string;
};

// const buildReturnUser = (user: any) => {
//     const baseUser = user.userId ?? user;

//     return {
//         _id: typeof baseUser?._id === "object" && baseUser?._id?.toString
//             ? baseUser._id.toString()
//             : baseUser?._id ?? user?.id,
//         email: baseUser?.email ?? null,
//         role: baseUser?.role ?? "buyer",
//         isVerified: Boolean(baseUser?.isVerified),
//         profilePictureUrl: baseUser?.profilePictureUrl ?? null,
//         username: baseUser.role === "buyer" ? baseUser?.buyerProfile?.username : null,
//         googleId: baseUser.role === "buyer" ? baseUser?.buyerProfile?.googleId : null,
//         fullName: (baseUser.role === "buyer") ? (baseUser?.buyerProfile?.fullName) : (baseUser.role === "seller") ? (baseUser?.sellerProfile?.fullName) : (baseUser.role === "admin") ? (baseUser?.adminProfile?.fullName) : null,
//         contact: (baseUser.role === "buyer") ? (baseUser?.buyerProfile?.contact) : (baseUser.role === "seller") ? (baseUser?.sellerProfile?.contact) : (baseUser.role === "admin") ? (baseUser?.adminProfile?.contact) : null,

//         buyerProfile:
//             baseUser.role === "buyer"
//                 ? (user.buyerProfile?._id || user._id)?.toString() || null
//                 : null,

//         sellerProfile:
//             baseUser.role === "seller"
//                 ? (user.sellerProfile?._id || user._id)?.toString() || null
//                 : null,

//         adminProfile:
//             baseUser.role === "admin"
//                 ? (user.adminProfile?._id || user._id)?.toString() || null
//                 : null,
//         // buyerProfile: baseUser?.buyerProfile ?? null,
//         // sellerProfile: baseUser?.sellerProfile ?? null,
//         // adminProfile: baseUser?.adminProfile ?? null
//     };
// };

const buildReturnUser = (user: any) => {
    // const baseUser = user.userId ?? user;

    return {
        _id: typeof user?._id === "object" && user?._id?.toString
            ? user._id.toString()
            : user?._id ?? user?.id,
        email: user?.email ?? null,
        role: user?.role ?? "buyer",
        isVerified: Boolean(user?.isVerified),
        profilePictureUrl: user?.profilePictureUrl ?? null,
        username: user?.role === "buyer" ? user?.username : null,
        googleId: user?.role === "buyer" ? user?.googleId : null,
        fullName: (user?.role === "buyer") ? (user?.fullName) : (user?.role === "seller") ? (user?.fullName) : (user?.role === "admin") ? (user?.fullName) : null,
        contact: (user?.role === "buyer") ? (user?.contact) : (user?.role === "seller") ? (user?.contact) : (user?.role === "admin") ? (user?.contact) : null,

        buyerProfile:
            user?.role === "buyer"
                ? user?.buyerProfile?.toString() || null
                : null,

        sellerProfile:
            user?.role === "seller"
                ? user?.sellerProfile?.toString() || null
                : null,

        adminProfile:
            user?.role === "admin"
                ? user?.adminProfile?.toString() || null
                : null,
    };
};

const userRepo = new UserRepository();
const buyerRepo = new BuyerRepository();
const sellerRepo = new SellerRepository();
const adminRepo = new AdminRepository();
const authService = new AuthService(userRepo, buyerRepo, sellerRepo, adminRepo);

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Username or Email or Contact", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials?: RawCredentials): Promise<any | null> {
                if (!credentials || !credentials.identifier) {
                    throw new Error("MISSING_CREDENTIALS");
                }
                if (!credentials.identifier || !credentials.password || !credentials.role) {
                    throw new Error("MISSING_CREDENTIALS");
                }

                const identifier = credentials.identifier.trim();
                const password = credentials.password;
                const role = (credentials.role ?? "buyer").toString();

                try {
                    if (!identifier || !password || !role) {
                        throw new Error("MISSING_CREDENTIALS");
                    }

                    const response = await authService.authenticate({
                        identifier: identifier,
                        password: password,
                        role: role as any ?? "buyer"
                    });

                    if (response.success) {
                        return buildReturnUser(response.user);
                    }

                    throw new Error(response.message ?? "AUTH_ERROR");
                }
                catch (error: any) {
                    throw new Error(error.message ?? "AUTH_ERROR");
                    // throw new Error(error);
                }
            }
        }),

        GoogleProvider({
            clientId: `${process.env.GOOGLE_CLIENT_ID}`,
            clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`
        })
    ],
    callbacks: {
        // Persist role and other profile fields into the JWT
        async jwt({ token, user, account, profile }) {
            // user object present on first sign in (credentials or provider)
            if (user) {
                const normalized = buildReturnUser(user);

                return {
                    ...token,
                    ...normalized,
                };
            }
            else if (account && profile) {
                try {
                    const normalized = await authService.findOrCreateFromProvider(profile as any, account.provider);
                    if (normalized && normalized.user) {
                        token._id = normalized.user._id ?? token._id;
                        token.email = normalized.user.email ?? token.email;
                        token.role = normalized.user.role as any ?? token.role;
                        token.isVerified = token.isVerified ?? normalized.user.isVerified;
                        token.fullName = normalized.user.fullName ?? token.fullName;
                        token.username = normalized.user.username ?? token.username;
                        token.profilePictureUrl = normalized.user.profilePictureUrl ?? token.profilePictureUrl;
                        token.buyerProfile = normalized.user.buyerProfile ?? token.buyerProfile;
                        token.googleId = normalized.user.googleId ?? token.googleId;
                    }
                }
                catch (error: any) {
                    console.error("Error in provider findOrCreate: ", error)
                    throw new Error(`Error in provider findOrCreate: ${error}`);
                }
            }
            return token;
        },

        // Attach the typed fields into session.user to match your next-auth.d.ts
        async session({ session, token }) {
            if (!session.user) {
                session.user = {} as any;
            }

            session.user = {
                ...session.user,
                _id: token._id,
                fullName: token.fullName,
                email: token.email,
                contact: token.contact ?? null,
                username: token.username ?? null,
                role: token.role,
                isVerified: token.isVerified,
                profilePictureUrl: token.profilePictureUrl ?? null,
                googleId: token.googleId ?? null,

                buyerProfile: token.buyerProfile ?? null,
                sellerProfile: token.sellerProfile ?? null,
                adminProfile: token.adminProfile ?? null,
            };

            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 // 1 day
    },
    secret: `${process.env.NEXTAUTH_SECRET}`
};