// src/dtos/auth.dto.ts
import { z } from "zod";
import { buyerIdentifierValidation, roleValidation, passwordValidation } from "@/schemas/user.schema.ts";

// Login Buyer DTO
export const LoginUserDto = z.object({
    identifier: buyerIdentifierValidation,
    password: passwordValidation,
    role: roleValidation
});
export type LoginUserDtoType = z.infer<typeof LoginUserDto>;


export const AuthResponseDto = z.object({
    _id: z.string(),
    email: z.email().optional().nullish(),
    role: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().optional().nullish(),
    username: z.string().optional().nullish(),
    contact: z.string().optional().nullish(),
    googleId: z.string().optional().nullish(),
    profilePictureUrl: z.string().optional().nullish(),
    // bio: z.string().optional().nullish(),
    buyerProfile: z.string().optional().nullish(),
    sellerProfile: z.string().optional().nullish(),
    adminProfile: z.string().optional().nullish(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type AuthResponseDtoType = {
    success: boolean;
    message?: string | null;
    user?: z.infer<typeof AuthResponseDto> | null;
};