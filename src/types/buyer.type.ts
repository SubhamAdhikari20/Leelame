// src/types/buyer.type.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, passwordValidation, bioValidation, termsAndConditionsValidation } from "./common-role.type";

export const usernameValidation = z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must not contain special characters" });

export const googleIdValidation = z.string().optional().nullish();

export const buyerSchema = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
    contact: contactValidation,
    password: passwordValidation,
    terms: termsAndConditionsValidation,

    userId: z.string()
});

export type Buyer = z.infer<typeof buyerSchema>;

// Database related type
export type BuyerDocument = Buyer & {
    _id: string;
    // userId: string;
    createdAt: Date;
    updatedAt: Date;
};