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
    interface User {
        _id: string;
        email: string;
        role: UserRole;
        baseUserId: string;
        isVerified: boolean;
        fullName?: string | null;
        username?: string | null;
        contact?: string | null;
    }

    interface Session {
        user: {
            _id: string;
            email: string;
            role: UserRole;
            isVerified: boolean;
            baseUserId: string;
            fullName?: string | null;
            username?: string | null;
            contact?: string | null;
        } & DefaultSession["user"];
        accessToken?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            _id: string;
            email: string;
            role: UserRole;
            isVerified: boolean;
            baseUserId: string;
            fullName?: string | null;
            username?: string | null;
            contact?: string | null;
        }
        accessToken?: string | null;
    }
}