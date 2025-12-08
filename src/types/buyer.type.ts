// src/types/buyer.type.ts
import { z } from "zod";
import { fullNameValidation, usernameValidation, contactValidation, passwordValidation, bioValidation, termsAndConditionsValidation } from "@/schemas/user.schema.ts";


export const buyerSchema = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
    contact: contactValidation,
    password: passwordValidation,
    terms: termsAndConditionsValidation,
    userId: z.string(),

    googleId: z.string().optional().nullish(),
    bio: bioValidation
});

export type Buyer = z.infer<typeof buyerSchema>;

// Database related type
export type BuyerDocument = Buyer & {
    _id: string;
    // userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export const googleProviderBuyerSchema = z.object({
    fullName: fullNameValidation.optional().nullish(),
    username: usernameValidation.optional().nullish(),
    contact: contactValidation.optional().nullish(),
    password: passwordValidation.optional().nullish(),
    terms: termsAndConditionsValidation,
    userId: z.string(),

    googleId: z.string().optional().nullish(),
    bio: bioValidation
});

export type ProviderBuyer = z.infer<typeof googleProviderBuyerSchema>;

// Database related type
export type ProviderBuyerDocument = ProviderBuyer & {
    _id: string;
    // userId: string;
    createdAt: Date;
    updatedAt: Date;
};
