// src/dtos/auth.dto.ts
import { z } from "zod";
import { identifierValidation, roleValidation, passwordValidation } from "@/schemas/user.schema.ts";

// Login Buyer DTO
export const LoginUserDto = z.object({
    identifier: identifierValidation,
    password: passwordValidation,
    role: roleValidation
});
export type LoginUserDtoType = z.infer<typeof LoginUserDto>;


export const AuthResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    role: z.string(),
    isVerified: z.boolean(),
    baseUserId: z.string(),
    fullName: z.string().nullish(),
    username: z.string().nullish(),
    contact: z.string().nullish(),
});

export type AuthResponseDtoType = {
    success: boolean;
    message?: string | null;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof AuthResponseDto> | null;
};