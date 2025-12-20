// src/models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";
import type { IBuyer } from "./buyer.model.ts";
import type { ISeller } from "./seller.model.ts";
import type { IAdmin } from "./admin.model.ts";
import type { User } from "@/types/user.type.ts";

export interface IUser extends Omit<User, ("buyerProfile" | "sellerProfile" | "adminProfile")>, Document {
    // export interface IUser extends User, Document {
    // email: string;
    // profilePictureUrl?: string | null;
    // role: "admin" | "seller" | "buyer";

    // Relations and References
    buyerProfile?: Schema.Types.ObjectId | string | null;
    sellerProfile?: Schema.Types.ObjectId | string | null;
    adminProfile?: Schema.Types.ObjectId | string | null;

    // Account Verification and Security
    // isVerified: boolean;
    // verifyCode?: string | null;
    // verifyCodeExpiryDate?: Date | null;
    // verifyEmailResetPassword?: string | null;
    // verifyEmailResetPasswordExpiryDate?: Date | null;

    // // Ban and Moderation
    // isPermanentlyBanned: boolean;
    // banReason?: string | null;
    // bannedAt?: Date | null;
    // bannedDateFrom?: Date | null;
    // bannedDateTo?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface IUserPopulated extends Omit<IUser, ("buyerProfile" | "sellerProfile" | "adminProfile")> {
    buyerProfile?: IBuyer | null;
    sellerProfile?: ISeller | null;
    adminProfile?: IAdmin | null;
}
// export interface IUserBuyerPopulated extends Omit<IUser, "buyerProfile"> {
//     buyerProfile?: IBuyer | null;
// }

const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"]
    },
    profilePictureUrl: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["admin", "seller", "buyer"],
        default: "buyer"
    },
    buyerProfile: {
        type: Schema.Types.ObjectId,
        ref: "buyers",
        default: null
    },
    sellerProfile: {
        type: Schema.Types.ObjectId,
        ref: "sellers",
        default: null
    },
    adminProfile: {
        type: Schema.Types.ObjectId,
        ref: "admins",
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        default: null
    },
    verifyCodeExpiryDate: {
        type: Date,
        default: null
    },
    verifyEmailResetPassword: {
        type: String,
        default: null
    },
    verifyEmailResetPasswordExpiryDate: {
        type: Date,
        default: null
    },
    isPermanentlyBanned: {
        type: Boolean,
        default: false
    },
    banReason: {
        type: String,
        default: null
    },
    bannedAt: {
        type: Date,
        default: null
    },
    bannedDateFrom: {
        type: Date,
        default: null
    },
    bannedDateTo: {
        type: Date,
        default: null
    },
},
    {
        timestamps: true
    }
);

const User = (mongoose.models.users as mongoose.Model<IUser>) ?? (mongoose.model<IUser>("users", userSchema));

// const User = mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;