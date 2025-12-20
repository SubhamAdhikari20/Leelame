// src/dtos/user.dto.ts
import { z } from "zod";
import { userSchema } from "@/types/user.type.ts";

// What clients sends when creating a new user x
export const CreatedUserDto = userSchema
    .omit({ buyerProfile: true, sellerProfile: true, adminProfile: true });

export type CreatedUserDtoType = z.infer<typeof CreatedUserDto>;

// what server responds with when sending user data 
export const UserResponseDto = z.object({
    _id: z.string(),
    email: z.string(),
    role: z.string(),
    isVerified: z.boolean(),
    isPermanentlyBanned: z.boolean(),
    buyerProfile: z.string().optional().nullable(),
    sellerProfile: z.string().optional().nullable(),
    adminProfile: z.string().optional().nullable(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type UserResponseDtoType = z.infer<typeof UserResponseDto>;