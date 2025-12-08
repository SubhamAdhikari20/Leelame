// src/types/user.type.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, passwordValidation } from "@/schemas/user.schema.ts";


export const sellerSchema = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    password: passwordValidation,
    userId: z.string(),

    sellerNotes: z.string().optional().nullish(),
    sellerStatus: z.string(),
    sellerVerificationDate: z.date().optional().nullish(),
    sellerAttemptCount: z.number(),
    sellerRuleViolationCount: z.number(),
    isSellerPermanentlyBanned: z.boolean(),
    sellerBannedAt: z.date().optional().nullish(),
    sellerBannedDateFrom: z.date().optional().nullish(),
    sellerBannedDateTo: z.date().optional().nullish()
});

export type Seller = z.infer<typeof sellerSchema>;

export type SellerDocument = Seller & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
};