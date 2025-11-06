// src/models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    profilePictureUrl?: string | null;
    role: "admin" | "seller" | "buyer";

    // Relations and References
    buyerProfile?: mongoose.Types.ObjectId | null;
    sellerProfile?: mongoose.Types.ObjectId | null;
    adminProfile?: mongoose.Types.ObjectId | null;

    // Account Verification and Security
    isVerified: boolean;
    verifyCode?: string | null;
    verifyCodeExpiryDate?: Date | null;
    verifyEmailResetPassword?: string | null;
    verifyEmailResetPasswordExpiryDate?: Date | null;

    // Ban and Moderation
    isPermanentlyBanned: boolean;
    banReason?: string | null;
    bannedAt?: Date | null;
    bannedDateFrom?: Date | null;
    bannedDateTo?: Date | null;
}

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