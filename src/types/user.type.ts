// src/types/user.type.ts
import { z } from "zod";

export const emailValidation = z
    .email()
    .min(5)
    .max(50)

export const profilePictureUrlValidation = z.string().optional().nullish();

export const roleValidation = z
    .enum(["admin", "seller", "buyer"]);

export const isVerifiedValidation = z.boolean();
export const verifyCodeValidation = z.string().optional().nullish();
export const verifyCodeExpiryDateValidation = z.date().optional().nullish();
export const verifyEmailResetPasswordValidation = z.string().optional().nullish();
export const verifyEmailResetPasswordExpiryDateValidation = z.date().optional().nullish();

export const isPermanentlyBannedValidation = z.boolean();
export const banReasonValidation = z.string().optional().nullish();
export const bannedAtValidation = z.date().optional().nullish();
export const bannedFromValidation = z.date().optional().nullish();
export const bannedToValidation = z.date().optional().nullish();


export const userSchema = z.object({
    email: emailValidation,
    profilePictureUrl: profilePictureUrlValidation,
    role: z.string(),
    isVerified: isVerifiedValidation,
    verifyCode: verifyCodeValidation,
    verifyCodeExpiryDate: verifyCodeExpiryDateValidation,
    verifyEmailResetPassword: verifyEmailResetPasswordValidation,
    verifyEmailResetPasswordExpiryDate: verifyEmailResetPasswordExpiryDateValidation,
    isPermanentlyBanned: isPermanentlyBannedValidation,
    banReason: banReasonValidation,
    bannedAt: bannedAtValidation,
    bannedDateFrom: bannedFromValidation,
    bannedDateTo: bannedToValidation,

    buyerProfile: z.string().optional().nullish(),
    sellerProfile: z.string().optional().nullish(),
    adminProfile: z.string().optional().nullish(),
});

export type User = z.infer<typeof userSchema>;

// Database related type
export type UserDocument = User & {
    _id: string;
    buyerProfile?: string | null;
    sellerProfile?: string | null;
    adminProfile?: string | null;
    createdAt: Date;
    updatedAt: Date;
};