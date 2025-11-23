// src/lib/auth/get-current-user.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options.ts";
import User from "@/models/user.model.ts";
import Buyer, { IBuyer } from "@/models/buyer.model.ts";
import Seller, { ISeller } from "@/models/seller.model.ts";
import Admin, { IAdmin } from "@/models/admin.model.ts";


export type FullUser = {
    _id: string;
    email: string;
    role: "buyer" | "seller" | "admin";
    isVerified: boolean;
    profilePictureUrl?: string | null;

    buyerProfile?: IBuyer | null;
    sellerProfile?: ISeller | null;
    adminProfile?: IAdmin | null;
} | null;

export const getCurrentUser = async (): Promise<FullUser> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
        return null;
    }
    const userId = session.user._id;
    const baseUser = await User.findById(userId);

    if (!baseUser) {
        return null;
    }

    const common: any = {
        _id: (baseUser._id as any).toString(),
        email: baseUser.email,
        role: baseUser.role,
        isVerified: baseUser.isVerified,
        profilePictureUrl: baseUser.profilePictureUrl ?? null,
    };

    switch (baseUser.role) {
        case "buyer":
            if (!session.user.buyerProfile) return { ...common, buyerProfile: null };
            const buyer = await Buyer.findById(session.user.buyerProfile).populate("userId");
            if (!buyer) return { ...common, buyerProfile: null };
            return { ...common, buyerProfile: buyer, sellerProfile: null, adminProfile: null };

        case "seller":
            if (!session.user.sellerProfile) return { ...common, sellerProfile: null };
            const seller = await Seller.findById(session.user.sellerProfile).populate("userId");
            if (!seller) return { ...common, sellerProfile: null };
            return { ...common, sellerProfile: seller, buyerProfile: null, adminProfile: null };

        case "admin":
            if (!session.user.adminProfile) return { ...common, adminProfile: null };
            const admin = await Admin.findById(session.user.adminProfile).populate("userId");
            if (!admin) return { ...common, adminProfile: null };
            return { ...common, adminProfile: admin, sellerProfile: null, buyerProfile: null };

        default:
            return common;
    }
};