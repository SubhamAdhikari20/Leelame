// src/dtos/buyer.dto.ts
import { z } from "zod";
import { buyerSchema } from "@/types/buyer.type.ts";
import { emailValidation, roleValidation, usernameValidation, passwordValidation, otpValidation, fullNameValidation, contactValidation } from "@/schemas/user.schema.ts";
import { BuyerDocument } from "@/types/buyer.type.ts";
import { UserDocument } from "@/types/user.type.ts";

// Create Buyer DTO
// export const CreatedBuyerDto = buyerSchema.extend({
//     email: emailValidation,
//     role: roleValidation
// });
export const CreatedBuyerDto = buyerSchema
    .omit({ userId: true })
    .extend({
        username: usernameValidation,
        contact: contactValidation,
        password: passwordValidation,
        email: emailValidation,
        role: roleValidation,
    });
export type CreatedBuyerDtoType = z.infer<typeof CreatedBuyerDto>;

// Check Username Unique DTO
export const CheckUsernameUniqueDto = z.object({
    username: usernameValidation
});
export type CheckUsernameUniqueDtoType = z.infer<typeof CheckUsernameUniqueDto>;

// Forgot Password DTO
export const ForgotPasswordDto = z.object({
    email: emailValidation
});
export type ForgotPasswordDtoType = z.infer<typeof ForgotPasswordDto>;

// Verify OTP for Registration DTO
export const VerifyOtpForRegistrationDto = z.object({
    username: usernameValidation,
    otp: otpValidation,
});
export type VerifyOtpForRegistrationDtoType = z.infer<typeof VerifyOtpForRegistrationDto>;

// Verify OTP for Reset Password DTO
export const VerifyOtpForResetPasswordDto = z.object({
    email: emailValidation,
    otp: otpValidation
});
export type VerifyOtpForResetPasswordDtoType = z.infer<typeof VerifyOtpForResetPasswordDto>;


export const ResetPasswordDto = z.object({
    email: emailValidation,
    newPassword: passwordValidation
});

export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;

// Verify OTP for Registration DTO
export const SendEmailForRegistrationDto = z.object({
    email: emailValidation,
});
export type SendEmailForRegistrationDtoType = z.infer<typeof SendEmailForRegistrationDto>;


// what server responds with when sending user data 
export const BuyerResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    userId: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().optional().nullish(),
    username: z.string().optional().nullish(),
    contact: z.string().optional().nullish(),
    profilePictureUrl: z.string().optional().nullish(),
    bio: z.string().optional().nullish(),
    role: z.string().optional().nullish(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    isPermanentlyBanned: z.boolean(),
});

// export type BuyerResponseDtoType = z.infer<typeof BuyerResponseDto>;

export type BuyerResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof BuyerResponseDto> | null;
    // user?: Partial<UserDocument> & Partial<BuyerDocument> | null;
};