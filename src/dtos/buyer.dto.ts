// src/dtos/buyer.dto.ts
import { z } from "zod";
import { fullNameValidation, usernameValidation, contactValidation, emailValidation, passwordValidation, roleValidation, otpValidation, termsAndConditionsValidation } from "@/schemas/user.schema.ts";


// Create Buyer DTO
export const CreatedBuyerDto = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
    contact: contactValidation,
    password: passwordValidation,
    email: emailValidation,
    role: roleValidation,
    terms: termsAndConditionsValidation,
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

// Update Profile Details DTO
export const UpdateBuyerProfileDetailsDto = z.object({
    fullName: fullNameValidation,
    email: emailValidation,
    username: usernameValidation,
    contact: contactValidation,
    bio: z.string().max(500)
});
export type UpdateBuyerProfileDetailsDtoType = z.infer<typeof UpdateBuyerProfileDetailsDto>;

// Upload Profile Picture DTO
export const UploadProfilePictureDto = z.object({
    profilePicture: z.instanceof(File, { message: "No file provided! Upload a file." }),
});
export type UploadProfilePictureDtoType = z.infer<typeof UploadProfilePictureDto>;

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
// ];
// export const imageUploadSchema = z.object({
//     image: z
//         .instanceof(File)
//         .refine((file) => file.size <= MAX_FILE_SIZE, {
//             message: "Max image size is 5MB",
//         })
//         .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
//             message: "Only .jpg, .jpeg, .png, .webp formats are supported",
//         }),
// });

// export const multipleImageSchema = z.object({
//     images: z
//         .array(z.instanceof(File))
//         .min(1, "At least one image is required")
//         .max(5, "Max 5 images allowed")
//         .refine(
//             (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
//             "Each image must be ≤ 5MB"
//         )
//         .refine(
//             (files) =>
//                 files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
//             "Only image files are allowed"
//         ),
// });


// what server responds with when sending user data 
export const BuyerResponseDto = z.object({
    _id: z.string(),
    email: z.email(),
    baseUserId: z.string(),
    role: z.string(),
    isVerified: z.boolean(),
    fullName: z.string().nullish(),
    username: z.string().nullish(),
    contact: z.string().nullish(),
    isPermanentlyBanned: z.boolean(),
    profilePictureUrl: z.string().nullish(),
    bio: z.string().nullish(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type BuyerResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    token?: string | null;
    user?: z.infer<typeof BuyerResponseDto> | null;
};

export const UploadImageResponseDto = z.object({
    imageUrl: z.url()
});

export type UploadImageResponseDtoType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof UploadImageResponseDto> | null;
}