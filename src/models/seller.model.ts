// src/models/seller.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISeller extends Document {
    userId: Schema.Types.ObjectId,
    fullName: string;
    contact: string;
    password: string;
    sellerNotes?: string | null;
    sellerStatus: "none" | "pending" | "verified" | "rejected";
    sellerVerificationDate?: Date | null;
    sellerAttemptCount: number;
    sellerRuleViolationCount: number;
    isSellerPermanentlyBanned: boolean;
    sellerBannedAt?: Date | null;
    sellerBannedDateFrom?: Date | null;
    sellerBannedDateTo?: Date | null;
}

const sellerSchema: Schema<ISeller> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
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
        required: [true, "Contact is required"],
        minLength: [10, "Contact must be 10 digits"],
        maxLength: [10, "Contact must be 10 digits"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
    },
    sellerNotes: {
        type: String,
        default: null,
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
},
    {
        timestamps: true
    }
);

const Seller = (mongoose.models.sellers as mongoose.Model<ISeller>) ?? (mongoose.model<ISeller>("sellers", sellerSchema));

export default Seller;