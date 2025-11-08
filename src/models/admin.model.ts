// src/models/admin.model.ts
import mongoose, { Schema, Document } from "mongoose";
import type { IUser } from "./user.model.ts";

export interface IAdmin extends Document {
    userId: Schema.Types.ObjectId,
    fullName: string;
    contact: string;
    password: string;
}

export interface IAdminPopulated extends Omit<IAdmin, "userId"> {
    userId: IUser;
}

const adminSchema: Schema<IAdmin> = new Schema({
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
},
    {
        timestamps: true
    }
);

const Admin = (mongoose.models.admins as mongoose.Model<IAdmin>) ?? (mongoose.model<IAdmin>("admins", adminSchema));

export default Admin;