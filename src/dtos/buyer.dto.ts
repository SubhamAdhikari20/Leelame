// src/dtos/buyer.dto.ts
import { z } from "zod";
import { buyerSchema } from "@/types/buyer.type.ts";

export const CreatedBuyerDto = buyerSchema.extend({
    email: z.email(),
    role: z.string()
});

export type CreatedBuyerDtoType = z.infer<typeof CreatedBuyerDto>;

// what server responds with when sending user data 
export const BuyerResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    userId: z.string(),
    isVerified: z.boolean(),
    isPermanentlyBanned: z.boolean(),
    fullName: z.string().optional().nullish(),
    username: z.string().optional().nullish(),
    contact: z.string().optional().nullish(),
    profilePictureUrl: z.string().optional().nullish(),
    bio: z.string().optional().nullish(),
    role: z.string().optional().nullish(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),

    // _id: z.string().optional().nullish(),
    // fullName: z.string().optional().nullish(),
    // username: z.string().optional().nullish(),
    // email: z.email().optional().nullish(),
    // contact: z.string().optional(),
    // profilePictureUrl: z.string().optional().nullish(),
    // bio: z.string().optional().nullish(),
    // role: z.string().optional().nullish(),
    // userId: z.string().optional().nullish(),
});

// export type BuyerResponseDtoType = z.infer<typeof BuyerResponseDto>;

export type BuyerResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof BuyerResponseDto> | null;
}