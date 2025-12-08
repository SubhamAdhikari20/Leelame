// src/types/current-user.ts
// import { IBuyer } from "@/models/buyer.model";
// import { ISeller } from "@/models/seller.model";
// import { IAdmin } from "@/models/admin.model";

type UserRole = "buyer" | "seller" | "admin";

export interface CurrentUser {
    _id: string;
    fullName: string;
    username?: string | null;
    contact?: string | null;
    email: string;
    role: UserRole;
    isVerified: boolean;
    profilePictureUrl?: string | null;
    googleId?: string | null;

    buyerProfile?: string | null;
    sellerProfile?: string | null;
    adminProfile?: string | null;
}