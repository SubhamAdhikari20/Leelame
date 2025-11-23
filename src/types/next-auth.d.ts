// src/types/next.auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";
import { Types } from "mongoose";
import { IUser } from "@/models/user.model.ts";
import { IBuyer } from "@/models/buyer.model.ts";
import { ISeller } from "@/models/seller.model.ts";
import { IAdmin } from "@/models/admin.model.ts";

type UserRole = "buyer" | "seller" | "admin";

declare module "next-auth" {
    interface User extends Partial<IUser> {
        _id: string;
        fullName: string;
        email: string;
        username?: string | null;
        contact?: string | null;
        role: UserRole;
        isVerified: boolean;
        profilePictureUrl?: string | null;
        googleId?: string | null;

        buyerProfile?: string | null;
        sellerProfile?: string | null;
        adminProfile?: string | null;

        // Optional populated references
        // buyerProfile?: IBuyer | Types.ObjectId | null;
        // sellerProfile?: ISeller | Types.ObjectId | null;
        // adminProfile?: IAdmin | Types.ObjectId | null;
    }

    interface Session {
        user: {
            _id: string;
            fullName: string;
            email: string;
            username?: string | null;
            contact?: string | null;
            role: UserRole;
            isVerified: boolean;
            profilePictureUrl?: string | null;
            googleId?: string | null;

            buyerProfile?: string | null;
            sellerProfile?: string | null;
            adminProfile?: string | null;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        fullName: string;
        email: string;
        username?: string | null;
        contact?: string | null;
        role: UserRole;
        isVerified: boolean;
        profilePictureUrl?: string | null;
        googleId?: string | null;

        buyerProfile?: string | null;
        sellerProfile?: string | null;
        adminProfile?: string | null;
    }
}