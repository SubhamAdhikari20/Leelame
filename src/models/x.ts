// src/models/x.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    contact?: string;
    username?: string;
    email: string;
    password?: string;
    googleId?: string;
    profilePictureUrl?: string | null;
    isVerified: boolean;
    bio?: string | null;
    verifyCode?: string | null;
    verifyCodeExpiryDate?: Date | null;
    verifyEmailResetPassword?: string | null;
    verifyEmailResetPasswordExpiryDate?: Date | null;
    terms: boolean;
    role: ("admin" | "seller" | "buyer")[];
    sellerStatus: "none" | "pending" | "verified" | "rejected";
    sellerVerificationDate?: Date | null;
    sellerNotes?: string | null;
    sellerAttemptCount: number;
    sellerRuleViolationCount: number;
    isSellerPermanentlyBanned: boolean;
    sellerBannedAt?: Date | null;
    sellerBannedDateFrom?: Date | null;
    sellerBannedDateTo?: Date | null;
    isPermanentlyBanned: boolean;
    banReason?: string | null;
    bannedAt?: Date | null;
    bannedDateFrom?: Date | null;
    bannedDateTo?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    contact: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        minLength: [10, "Contact must be 10 digits"],
        maxLength: [10, "Contact must be 10 digits"],
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^[a-zA-Z0-9_]+$/, "IUsername can only contain letters, numbers, and underscores"],
        minLength: [3, "IUsername must be at least 3 characters"],
        maxLength: [30, "IUsername cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"],
    },
    password: {
        type: String,
        minLength: [8, "Password must be at least 8 characters"],
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    profilePictureUrl: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
        maxLength: [500, "Bio cannot exceed 500 characters"],
        default: null,
    },
    verifyCode: {
        type: String,
        default: null,
    },
    verifyCodeExpiryDate: {
        type: Date,
        default: null,
    },
    verifyEmailResetPassword: {
        type: String,
        default: null,
    },
    verifyEmailResetPasswordExpiryDate: {
        type: Date,
        default: null,
    },
    terms: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: [String],
        enum: ["admin", "seller", "buyer"],
        default: ["buyer"],
    },
    sellerStatus: {
        type: String,
        enum: ["none", "pending", "verified", "rejected"],
        default: "none",
    },
    sellerVerificationDate: {
        type: Date,
        default: null,
    },
    sellerNotes: {
        type: String,
        default: null,
    },
    sellerAttemptCount: {
        type: Number,
        default: 0,
    },
    sellerRuleViolationCount: {
        type: Number,
        default: 0,
    },
    isSellerPermanentlyBanned: {
        type: Boolean,
        default: false,
    },
    sellerBannedAt: {
        type: Date,
        default: null,
    },
    sellerBannedDateFrom: {
        type: Date,
        default: null,
    },
    sellerBannedDateTo: {
        type: Date,
        default: null,
    },
    isPermanentlyBanned: {
        type: Boolean,
        default: false,
    },
    banReason: {
        type: String,
        default: null,
    },
    bannedAt: {
        type: Date,
        default: null,
    },
    bannedDateFrom: {
        type: Date,
        default: null,
    },
    bannedDateTo: {
        type: Date,
        default: null,
    },
},
    {
        timestamps: true,
    }
);


const User = (mongoose.model<IUser>("users", userSchema)) || (mongoose.models.IUser as mongoose.Model<IUser>, userSchema);

export default User;