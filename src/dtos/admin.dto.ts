// src/dtos/admin.dto.ts
import { z } from "zod";
import { fullNameValidation, emailValidation, contactValidation, otpValidation, passwordValidation, roleValidation } from "@/schemas/user.schema.ts";


// Create Admin DTO
export const CreatedAdminDto = z.object({
    fullName: fullNameValidation,
    email: emailValidation,
    contact: contactValidation,
    password: passwordValidation,
    role: roleValidation
});
export type CreatedAdminDtoType = z.infer<typeof CreatedAdminDto>;

// Verify OTP for Registration DTO
export const VerifyOtpForRegistrationDto = z.object({
    email: emailValidation,
    otp: otpValidation,
});
export type VerifyOtpForRegistrationDtoType = z.infer<typeof VerifyOtpForRegistrationDto>;

// Forgot Password DTO
export const ForgotPasswordDto = z.object({
    email: emailValidation
});
export type ForgotPasswordDtoType = z.infer<typeof ForgotPasswordDto>;

// Verify OTP for Reset Password DTO
export const VerifyOtpForResetPasswordDto = z.object({
    email: emailValidation,
    otp: otpValidation
});
export type VerifyOtpForResetPasswordDtoType = z.infer<typeof VerifyOtpForResetPasswordDto>;

// Reset Password DTO
export const ResetPasswordDto = z.object({
    email: emailValidation,
    newPassword: passwordValidation
});

export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;

// // Verify OTP and Reset Pasword DTO
// export const ResetPasswordDto = z.object({
//     email: emailValidation,
//     otp: otpValidation,
//     newPassword: passwordValidation
// });
// export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;

// Send Email for Registration DTO
export const SendEmailForRegistrationDto = z.object({
    email: emailValidation,
});
export type SendEmailForRegistrationDtoType = z.infer<typeof SendEmailForRegistrationDto>;


// Seller Response
export const AdminResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    baseUserId: z.string(),
    role: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().nullish(),
    contact: z.string().nullish(),
    isPermanentlyBanned: z.boolean(),
    profilePictureUrl: z.string().nullish(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type AdminResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof AdminResponseDto> | null;
};