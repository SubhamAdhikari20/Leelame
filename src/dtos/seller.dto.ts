// src/dtos/seller.dto.ts
import { z } from "zod";
import { fullNameValidation, emailValidation, contactValidation, otpValidation, passwordValidation, roleValidation } from "@/schemas/user.schema.ts";


// Create Seller DTO
export const CreatedSellerDto = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    email: emailValidation,
    role: roleValidation
});
export type CreatedSellerDtoType = z.infer<typeof CreatedSellerDto>;

// Verify OTP for Registration DTO
export const VerifyOtpForRegistrationDto = z.object({
    email: emailValidation,
    otp: otpValidation,
    password: passwordValidation,
});
export type VerifyOtpForRegistrationDtoType = z.infer<typeof VerifyOtpForRegistrationDto>;

// Forgot Password DTO
export const ForgotPasswordDto = z.object({
    email: emailValidation
});
export type ForgotPasswordDtoType = z.infer<typeof ForgotPasswordDto>;

// Verify OTP and Reset Pasword DTO
export const ResetPasswordDto = z.object({
    email: emailValidation,
    otp: otpValidation,
    newPassword: passwordValidation
});
export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;

// Send Email for Registration DTO
export const SendEmailForRegistrationDto = z.object({
    email: emailValidation,
});
export type SendEmailForRegistrationDtoType = z.infer<typeof SendEmailForRegistrationDto>;


// Update Profile Details DTO
export const UpdateSellerProfileDetailsDto = z.object({
    fullName: fullNameValidation.optional(),
    contact: contactValidation.optional(),
    email: emailValidation.optional(),
    bio: z.string().max(500).nullish(),
});
export type UpdateSellerProfileDetailsDtoType = z.infer<typeof UpdateSellerProfileDetailsDto>;

// Seller Response
export const SellerResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    baseUserId: z.string(),
    role: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().nullish(),
    contact: z.string().nullish(),
    isPermanentlyBanned: z.boolean(),
    profilePictureUrl: z.string().nullish(),
    bio: z.string().nullish(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type SellerResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof SellerResponseDto> | null;
};