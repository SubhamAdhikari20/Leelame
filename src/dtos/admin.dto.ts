// src/dtos/admin.dto.ts
import { z } from "zod";
import { adminSchema } from "@/types/admin.type.ts";
import { emailValidation, otpValidation, passwordValidation, roleValidation } from "@/schemas/user.schema.ts";


// Create Admin DTO
export const CreatedAdminDto = adminSchema
    .omit({ userId: true })
    .extend({
        email: emailValidation,
        role: roleValidation
    });
export type CreatedAdminDtoType = z.infer<typeof CreatedAdminDto>;

// Verify OTP for Registration DTO
export const VerifyOtpForRegistrationDto = z.object({
    email: emailValidation,
    otp: otpValidation,
    password: passwordValidation,
});
export type VerifyOtpForRegistrationDtoType = z.infer<typeof VerifyOtpForRegistrationDto>;

export const AdminResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    userId: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().optional().nullish(),
    contact: z.string().optional().nullish(),
    profilePictureUrl: z.string().optional().nullish(),
    role: z.string().optional().nullish(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    isPermanentlyBanned: z.boolean(),
});

export type AdminResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof AdminResponseDto> | null;
};