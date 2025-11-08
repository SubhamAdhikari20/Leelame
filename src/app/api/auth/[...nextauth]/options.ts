// src/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User, { IUserPopulated } from "@/models/user.model.ts";
import Buyer, { IBuyerPopulated } from "@/models/buyer.model.ts";
import Seller, { ISellerPopulated } from "@/models/seller.model.ts";
import Admin, { IAdminPopulated } from "@/models/admin.model.ts";


type RawCredentials = {
    identifier?: string;
    password?: string;
    role?: "buyer" | "seller" | "admin" | string;
};

// const findUserByEmail = async (email?: string) => {
//     if (!email) return null;
//     return await User.findOne({ email: email?.trim() });
// };

// const buildReturnUser = (userDoc: any, profileFields: any = {}) => {
//     return {
//         _id: typeof userDoc?._id === "object" && userDoc?._id?.toString
//             ? userDoc._id.toString()
//             : userDoc?._id ?? userDoc?.id ?? null,
//         email: userDoc?.email ?? profileFields.email ?? null,
//         role: userDoc?.role ?? profileFields.role ?? "buyer",
//         isVerified: !!userDoc?.isVerified,
//         profilePictureUrl: userDoc?.profilePictureUrl ?? profileFields.profilePictureUrl ?? null,
//         fullName: profileFields.fullName ?? null,
//         username: profileFields.username ?? null,
//         contact: profileFields.contact ?? null,
//     };
// };

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
                const identifier = credentials?.identifier?.trim();
                const password = credentials?.password;
                const role = (credentials?.role ?? "buyer").toString();

                try {
                    if (!identifier || !password || !role) {
                        return null;
                    }

                    // 1) Admin: email-only
                    if (role === "admin") {
                        // only allow email as identifier for admin
                        const user = await User.findOne({ email: identifier }).populate<IUserPopulated>("adminProfile");
                        if (!user || user.role !== "admin") {
                            return null;
                        }

                        const hashedPassword = user.adminProfile?.password ?? null;
                        if (!hashedPassword) {
                            return null;
                        }
                        const isMatched = await bcrypt.compare(password, hashedPassword);
                        if (!isMatched) {
                            return null;

                        }

                        return user;

                        // const user = await findUserByEmail(identifier);
                        // if (!user || user.role !== "admin") return null;

                        // // The admin profile may store password in Admin model or elsewhere.
                        // const adminProfile = await Admin.findOne({ userId: user._id }).populate<IAdminPopulated>("userId");
                        // const hashedPassword = adminProfile?.password ?? null;

                        // if (!hashedPassword) return null;
                        // const isMatched = await bcrypt.compare(password, hashedPassword);
                        // if (!isMatched) return null;

                        // return user;

                        // return buildReturnUser(adminProfile?.userId, {
                        //     fullName: adminProfile?.fullName ?? null,
                        //     contact: adminProfile?.contact ?? null,
                        // });

                    }

                    // 2) Seller: email or contact
                    if (role === "seller") {
                        // Try email first (User collection)
                        let user = await User.findOne({ email: identifier }).populate<IUserPopulated>("sellerProfile");

                        // let user = await findUserByEmail(identifier);

                        if (user && user.role === "seller") {
                            const hashedPassword= user.sellerProfile?.password ?? null;
                            if (!hashedPassword) {
                                return null;

                            }

                            const isMatched = await bcrypt.compare(password, hashedPassword);
                            if (!isMatched) {
                                return null;
                            }

                            return user;

                            // const sellerProfile = await Seller.findOne({ userId: user._id });
                            // if (!sellerProfile?.password) return null;
                            // const ok = await bcrypt.compare(password, sellerProfile.password);
                            // if (!ok) return null;

                            // return buildReturnUser(user, {
                            //     fullName: sellerProfile.fullName,
                            //     username: undefined,
                            //     contact: sellerProfile.contact,
                            // });
                        }
                        // If not found by email, try contact lookup in seller collection
                        const sellerByContact = await Seller.findOne({ contact: identifier }).populate<ISellerPopulated>("userId");
                        if (!sellerByContact) {
                            return null;
                        }

                        const sellerUserDoc = sellerByContact.userId;
                        if (!sellerUserDoc || sellerUserDoc.role !== "seller") {
                            return null;
                        }

                        // password stored in seller profile
                        if (!sellerByContact.password) {
                            return null;
                        }
                        const isMatched = await bcrypt.compare(password, sellerByContact.password);
                        if (!isMatched) {
                            return null;
                        }

                        return user;

                        // // If not found by email, try contact lookup in seller collection
                        // const sellerByContact = await Seller.findOne({ contact: identifier }).populate<ISellerPopulated>("userId");
                        // if (!sellerByContact) return null;

                        // const sellerUserDoc = sellerByContact.userId;
                        // if (!sellerUserDoc || sellerUserDoc.role !== "seller") return null;

                        // // password stored in seller profile
                        // if (!sellerByContact.password) return null;
                        // const okContact = await bcrypt.compare(password, sellerByContact.password);
                        // if (!okContact) return null;

                        // return buildReturnUser(sellerUserDoc, {
                        //     fullName: sellerByContact.fullName,
                        //     contact: sellerByContact.contact,
                        // });
                    }

                    // 3) BUYER: email OR username
                    if (role === "buyer") {
                        // Try email first (User collection)
                        // let user = await findUserByEmail(identifier);

                        let user = await User.findOne({ email: identifier }).populate<IUserPopulated>("buyerProfile");

                        if (user && user.role === "buyer") {
                            const hashedPassword = user.buyerProfile?.password ?? null;
                            if (!hashedPassword) {
                                return null;
                            }

                            const isMatched = await bcrypt.compare(password, hashedPassword);
                            if (!isMatched) {
                                return null;
                            }
                            return user;

                            // const buyerProfile = await Buyer.findOne({ userId: user._id });
                            // if (buyerProfile?.password) {
                            //     const ok = await bcrypt.compare(password, buyerProfile.password);
                            //     if (!ok) return null;

                            //     return buildReturnUser(user, {
                            //         fullName: buyerProfile.fullName,
                            //         username: buyerProfile.username,
                            //         contact: buyerProfile.contact,
                            //     });
                            // }

                            // If buyer profile lacks password but user doc stores some secret (uncommon),
                            // you could compare against user.password (not present in your User schema).
                            // For security clarity: prefer storing password in role profile (buyer/seller).
                            // return buildReturnUser(user, {
                            //     fullName: buyerProfile?.fullName ?? null,
                            //     username: buyerProfile?.username ?? null,
                            //     contact: buyerProfile?.contact ?? null,
                            // });

                        }

                        // If not found by email, try username in buyer collection
                        const buyerByUsername = await Buyer.findOne({ username: identifier }).populate<IBuyerPopulated>("userId");
                        if (!buyerByUsername) {
                            return null;
                        }

                        const buyerUserDoc = buyerByUsername.userId;
                        if (!buyerUserDoc || buyerUserDoc.role !== "buyer") {
                            return null;
                        }

                        if (!buyerByUsername.password) {
                            return null;
                        }
                        const isMatched = await bcrypt.compare(password, buyerByUsername.password);
                        if (!isMatched) {
                            return null;
                        }

                        return user;

                        // // If not found by email, try username in buyer collection
                        // const buyerByUsername = await Buyer.findOne({ username: identifier }).populate<IBuyerPopulated>("userId");
                        // if (!buyerByUsername) return null;

                        // const buyerUserDoc = buyerByUsername.userId;
                        // if (!buyerUserDoc || buyerUserDoc.role !== "buyer") return null;

                        // if (!buyerByUsername.password) return null;
                        // const okUsername = await bcrypt.compare(password, buyerByUsername.password);
                        // if (!okUsername) return null;

                        // return buildReturnUser(buyerUserDoc, {
                        //     fullName: buyerByUsername.fullName,
                        //     username: buyerByUsername.username,
                        //     contact: buyerByUsername.contact,
                        // });
                    }
                    return null;
                }
                catch (error: any) {
                    throw new Error(error);
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
                // normalize to the shape expected by your types (use _id)
                token._id = (user as any)._id ?? (user as any).id ?? token._id;
                token.email = (user as any).email ?? token.email;
                token.role = (user as any).role ?? token.role ?? "buyer";
                token.isVerified = !!(user as any).isVerified;
                token.profilePictureUrl = (user as any).profilePictureUrl ?? token.profilePictureUrl ?? null;

                // token.fullName = (user as any).fullName ?? token.fullName ?? null;
                // token.username = (user as any).username ?? token.username ?? null;
                // token.contact = (user as any).contact ?? token.contact ?? null;

                if (token.buyerProfile && token.role === "buyer") {
                    token.buyerProfile.fullName = (user as any).buyerProfile?.fullName ?? token.buyerProfile.fullName ?? null;
                    token.buyerProfile.username = (user as any).buyerProfile?.username ?? token.buyerProfile.username ?? null;
                    token.buyerProfile.contact = (user as any).buyerProfile?.contact ?? token.buyerProfile.contact ?? null;
                }
                if (token.sellerProfile && token.role === "seller") {
                    token.sellerProfile.fullName = (user as any).sellerProfile?.fullName ?? token.sellerProfile.fullName ?? null;
                    token.sellerProfile.contact = (user as any).sellerProfile?.contact ?? token.sellerProfile.contact ?? null;
                }
                if (token.adminProfile && token.role === "admin") {
                    token.adminProfile.fullName = (user as any).adminProfile?.fullName ?? token.adminProfile.fullName ?? null;
                    token.adminProfile.contact = (user as any).adminProfile?.contact ?? token.adminProfile.contact ?? null;
                }

            }
            else if (account && profile) {
                // Example: a provider login (Google). If you want to automatically create/find a user,
                // implement that logic here (find or create User + Buyer record, set role etc.)
                // For now, we keep provider tokens minimal; you should extend based on your desired flow.
                token.email = token.email ?? (profile as any).email;
                token.fullName = token.fullName ?? (profile as any).name;
            }
            return token;
        },

        // Attach the typed fields into session.user to match your next-auth.d.ts
        async session({ session, token }) {
            if (!session.user) session.user = {} as any;

            session.user._id = (token as any)._id ?? session.user._id;
            session.user.email = (token as any).email ?? session.user.email;
            session.user.role = (token as any).role ?? session.user.role;
            session.user.isVerified = !!(token as any).isVerified;
            session.user.profilePictureUrl = (token as any).profilePictureUrl ?? session.user.profilePictureUrl ?? null;
            if (session.user.buyerProfile && session.user.role === "buyer") {
                session.user.buyerProfile.fullName = (token as any).buyerProfile?.fullName ?? session.user.buyerProfile.fullName ?? null;
                session.user.buyerProfile.username = (token as any).buyerProfile?.username ?? session.user.buyerProfile.username ?? null;
                session.user.buyerProfile.contact = (token as any).buyerProfile?.contact ?? session.user.buyerProfile.contact ?? null;
            }
            if (session.user.sellerProfile && session.user.role === "seller") {
                session.user.sellerProfile.fullName = (token as any).sellerProfile?.fullName ?? session.user.sellerProfile.fullName ?? null;
                session.user.sellerProfile.contact = (token as any).sellerProfile?.contact ?? session.user.sellerProfile.contact ?? null;
            }
            if (session.user.adminProfile && session.user.role === "admin") {
                session.user.adminProfile.fullName = (token as any).adminProfile?.fullName ?? session.user.adminProfile.fullName ?? null;
                session.user.adminProfile.contact = (token as any).adminProfile?.contact ?? session.user.adminProfile.contact ?? null;
            }

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