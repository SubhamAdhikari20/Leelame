// src/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/services/auth.service.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { SellerRepository } from "@/repositories/seller.repository.ts";
import { AdminRepository } from "@/repositories/admin.repository.ts";
import { AuthResponseDto, LoginUserDto } from "@/dtos/auth.dto.ts";
import { HttpError } from "@/errors/http-error.ts";
import { z } from "zod";


type RawCredentials = {
    identifier: string;
    password: string;
    role: "buyer" | "seller" | "admin" | string;
};

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
                if (!credentials?.identifier || !credentials?.password || !credentials?.role) {
                    throw new HttpError(400, "Missing credentails! Credentails are required!");
                    // throw new Error("MISSING_CREDENTIALS");
                }

                // const identifier = credentials.identifier.trim();
                // const password = credentials.password.trim();
                // const role = (credentials.role ?? "buyer").toString();

                // if (!identifier || !password || !role) {
                //     throw new Error("Missing credentails! Credentails are required!");
                //     // throw new Error("MISSING_CREDENTIALS");
                // }

                try {
                    const validatedData = LoginUserDto.safeParse(credentials);
                    if (!validatedData.success) {
                        throw new HttpError(400, z.prettifyError(validatedData.error));
                        // throw new Error("Missing credentails! Credentails are required!");
                    }

                    const response = await authService.authenticate(validatedData.data);

                    const validatedResponseAuthData = AuthResponseDto.safeParse(response.user);
                    if (!validatedResponseAuthData.success) {
                        throw new HttpError(400, z.prettifyError(validatedResponseAuthData.error) ?? "Unknown error!");
                    }

                    return buildReturnUser(validatedResponseAuthData.data);
                }
                catch (error: any) {
                    console.error("Error in login:", error);

                    if (error instanceof HttpError) {
                        throw new HttpError(error.status, error.message);
                        // throw new Error(error.message);
                    }

                    throw new HttpError(500, "Internal Server Error");
                    // throw new Error("Internal Server Error");
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
                    const response = await authService.findOrCreateFromProvider(profile as any, account.provider);
                    if (response && response.user) {
                        token._id = response.user._id ?? token._id;
                        token.email = response.user.email ?? token.email;
                        token.role = response.user.role as any ?? token.role;
                        token.isVerified = token.isVerified ?? response.user.isVerified;
                        token.fullName = response.user.fullName ?? token.fullName;
                        token.username = response.user.username ?? token.username;
                        token.profilePictureUrl = response.user.profilePictureUrl ?? token.profilePictureUrl;
                        token.buyerProfile = response.user.buyerProfile ?? token.buyerProfile;
                        token.googleId = response.user.googleId ?? token.googleId;

                        const normalized = buildReturnUser(response.user);
                        return {
                            ...token,
                            ...normalized,
                        };
                    }
                }
                catch (error: any) {
                    console.error("Error in provider findOrCreate: ", error)

                    if (error instanceof HttpError) {
                        throw new HttpError(error.status, error.message);
                        // throw new Error(error.message);
                    }

                    throw new HttpError(500, "Internal Server Error");
                    // throw new Error("Internal Server Error");
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