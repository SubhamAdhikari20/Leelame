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
    return {
        _id: typeof user?._id === "object" && user?._id?.toString()
            ? user._id.toString()
            : user?._id ?? user?.id,
        email: user?.email,
        role: user?.role ?? "buyer",
        isVerified: Boolean(user?.isVerified),
        baseUserId: user?.baseUserId.toString(),
        fullName: (user?.role === "buyer") ? (user?.fullName) : (user?.role === "seller") ? (user?.fullName) : (user?.role === "admin") ? (user?.fullName) : null,
        username: user?.role === "buyer" ? user?.username : null,
        contact: (user?.role === "buyer") ? (user?.contact) : (user?.role === "seller") ? (user?.contact) : (user?.role === "admin") ? (user?.contact) : null,

        // profilePictureUrl: user?.profilePictureUrl ?? null,
        // googleId: user?.role === "buyer" ? user?.googleId : null,
        // buyerProfile:
        //     user?.role === "buyer"
        //         ? user?.buyerProfile?.toString() || null
        //         : null,

        // sellerProfile:
        //     user?.role === "seller"
        //         ? user?.sellerProfile?.toString() || null
        //         : null,

        // adminProfile:
        //     user?.role === "admin"
        //         ? user?.adminProfile?.toString() || null
        //         : null,
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
                }

                try {
                    const validatedData = LoginUserDto.safeParse(credentials);
                    if (!validatedData.success) {
                        throw new HttpError(400, z.prettifyError(validatedData.error));
                    }

                    const response = await authService.authenticate(validatedData.data);

                    const validatedResponseAuthData = AuthResponseDto.safeParse(response.user);
                    if (!validatedResponseAuthData.success) {
                        throw new HttpError(400, z.prettifyError(validatedResponseAuthData.error) ?? "Unknown error!");
                    }

                    return { ...buildReturnUser(validatedResponseAuthData.data), accessToken: response.token };
                }
                catch (error: any) {
                    console.error("Error in login:", error);

                    if (error instanceof HttpError) {
                        throw new HttpError(error.status, error.message);
                    }

                    throw new HttpError(500, "Internal Server Error");
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

                token.user = {
                    ...((token as any).user ?? {}),
                    ...normalized,
                };
                (token as any)._id = token.user._id ?? (token as any)._id ?? null;
                (token as any).email = token.user.email ?? (token as any).email ?? null;
                (token as any).role = token.user.role ?? (token as any).role ?? "buyer";
                (token as any).isVerified = token.user.isVerified ?? (token as any).isVerified ?? false;
                (token as any).baseUserId = token.user.baseUserId ?? (token as any).baseUserId ?? null;
                (token as any).fullName = token.user.fullName ?? (token as any).fullName ?? null;
                (token as any).username = token.user.username ?? (token as any).username ?? null;
                (token as any).contact = token.user.contact ?? (token as any).contact ?? null;

                const userAccessToken = (user as any)?.accessToken ?? null;
                (token as any).accessToken = userAccessToken ?? (token as any).accessToken ?? null;

                return token;
            }
            else if (account && profile) {
                try {
                    const response = await authService.findOrCreateFromProvider(profile as any, account.provider);
                    if (response && response.user) {
                        const normalized = buildReturnUser(response.user);

                        token.user = {
                            ...((token as any).user ?? {}),
                            ...normalized,
                        };

                        (token as any)._id = token.user._id ?? (token as any)._id ?? null;
                        (token as any).email = token.user.email ?? (token as any).email ?? null;
                        (token as any).role = token.user.role ?? (token as any).role ?? "buyer";
                        (token as any).isVerified = token.user.isVerified ?? (token as any).isVerified ?? false;
                        (token as any).baseUserId = token.user.baseUserId ?? (token as any).baseUserId ?? null;
                        (token as any).fullName = token.user.fullName ?? (token as any).fullName ?? null;
                        (token as any).username = token.user.username ?? (token as any).username ?? null;
                        (token as any).contact = token.user.contact ?? (token as any).contact ?? null;

                        (token as any).accessToken = response.token ?? (token as any).accessToken ?? null;

                        return token;
                    }
                }
                catch (error: any) {
                    console.error("Error in provider findOrCreate: ", error)

                    if (error instanceof HttpError) {
                        throw new HttpError(error.status, error.message);
                    }

                    throw new HttpError(500, "Internal Server Error");
                }
            }
            return token;
        },

        // Attach the typed fields into session.user to match your next-auth.d.ts
        async session({ session, token }) {
            if (!session.user) {
                session.user = {} as any;
            }
            // Prefer token.user if present, otherwise use top-level values.
            const tokenUser = (token as any).user ?? {
                _id: (token as any)._id ?? null,
                email: (token as any).email ?? null,
                role: (token as any).role ?? "buyer",
                isVerified: (token as any).isVerified ?? false,
                baseUserId: (token as any).baseUserId ?? null,
                fullName: (token as any).fullName ?? null,
                username: (token as any).username ?? null,
                contact: (token as any).contact ?? null,
            };
            session.accessToken = (token as any).accessToken ?? null;

            session.user = {
                ...session.user,
                _id: tokenUser._id,
                email: tokenUser.email,
                role: tokenUser.role,
                isVerified: tokenUser.isVerified,
                baseUserId: tokenUser.baseUserId,
                fullName: tokenUser.fullName ?? null,
                username: tokenUser.username ?? null,
                contact: tokenUser.contact ?? null,
            };

            // session.user = {
            //     ...session.user,
            //     _id: token.user._id,
            //     email: token.user.email,
            //     role: token.user.role,
            //     isVerified: token.user.isVerified,
            //     baseUserId: token.user.baseUserId,
            //     fullName: token.user.fullName ?? null,
            //     contact: token.user.contact ?? null,
            //     username: token.user.username ?? null,
            // };

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