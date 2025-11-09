// src/types/current-user.ts
import { IBuyer } from "@/models/buyer.model";
import { ISeller } from "@/models/seller.model";
import { IAdmin } from "@/models/admin.model";

type UserRole = "buyer" | "seller" | "admin";

export interface CurrentUser {
    _id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    profilePictureUrl?: string | null;
    buyerProfile?: IBuyer | null;
    sellerProfile?: ISeller | null;
    adminProfile?: IAdmin | null;
}