// src/dtos/seller.dto.ts
import { z } from "zod";
import { sellerSchema } from "@/types/seller.type.ts";
import { emailValidation, otpValidation, passwordValidation, roleValidation } from "@/schemas/user.schema.ts";


// Create Seller DTO
export const CreatedSellerDto = sellerSchema
    .omit({ userId: true })
    .extend({
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