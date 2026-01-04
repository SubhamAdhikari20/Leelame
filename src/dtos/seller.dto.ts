// src/dtos/seller.dto.ts
import { z } from "zod";
import { fullNameValidation, emailValidation, contactValidation, otpValidation, passwordValidation, roleValidation } from "@/schemas/user.schema.ts";
// import { sellerSchema } from "@/types/seller.type.ts";


// Create Seller DTO
export const CreatedSellerDto = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    email: emailValidation,
    role: roleValidation
});
// export const CreatedSellerDto = sellerSchema
//     .omit({ userId: true })
//     .extend({
//         email: emailValidation,
//         role: roleValidation
//     });
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


// Seller Response
export const SellerResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    userId: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().optional().nullish(),
    contact: z.string().optional().nullish(),
    profilePictureUrl: z.string().optional().nullish(),
    bio: z.string().optional().nullish(),
    role: z.string().optional().nullish(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    isPermanentlyBanned: z.boolean(),
});

export type SellerResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof SellerResponseDto> | null;
};