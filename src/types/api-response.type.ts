// src/types/api-response.type.ts
import { z } from "zod";


// ---------------------------------- Buyer Response ---------------------------------
export const BuyerApiResponse = z.object({
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

export type BuyerApiResponseType = {
    success: boolean;
    message: string;
    token?: string | null;
    user?: z.infer<typeof BuyerApiResponse> | null;
};

export const UploadImageBuyerApiResponse = z.object({
    imageUrl: z.url()
});

export type UploadImageBuyerApiResponseType = {
    success: boolean;
    message: string;
    data?: z.infer<typeof UploadImageBuyerApiResponse> | null;
};


// ---------------------------------- Seller Response ---------------------------------
export const SellerApiResponse = z.object({
    _id: z.string(),
    email: z.email(),
    role: z.string(),
    isVerified: z.boolean(),
    baseUserId: z.string(),
    fullName: z.string().nullish(),
    contact: z.string().nullish(),
    isPermanentlyBanned: z.boolean(),
    profilePictureUrl: z.string().nullish(),
    bio: z.string().nullish(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type SellerApiResponseType = {
    success: boolean;
    message: string;
    token?: string | null;
    user?: z.infer<typeof SellerApiResponse> | null;
};

export const UploadImageSellerApiResponse = z.object({
    imageUrl: z.url()
});

export type UploadImageSellerApiResponseType = {
    success: boolean;
    message: string;
    data?: z.infer<typeof UploadImageSellerApiResponse> | null;
};


// ---------------------------------- Admin Response ---------------------------------
export const AdminApiResponse = z.object({
    _id: z.string(),
    email: z.email(),
    role: z.string(),
    isVerified: z.boolean(),
    baseUserId: z.string(),
    fullName: z.string().nullish(),
    contact: z.string().nullish(),
    profilePictureUrl: z.string().nullish(),
    isPermanentlyBanned: z.boolean(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type AdminApiResponseType = {
    success: boolean;
    message: string;
    token?: string | null;
    user?: z.infer<typeof AdminApiResponse> | null;
};

export const UploadImageAdminApiResponse = z.object({
    imageUrl: z.url()
});

export type UploadImageAdminApiResponseType = {
    success: boolean;
    message: string;
    data?: z.infer<typeof UploadImageAdminApiResponse> | null;
};

export type AllSellerApiResposeType = {
    success: boolean;
    message: string;
    users?: z.infer<typeof SellerApiResponse>[] | null;
};

// -------------------------------- Category Api Response -------------------------------
// Category Api Response
export const CategoryApiResponse = z.object({
    _id: z.string(),
    categoryName: z.string(),
    description: z.string().nullish(),
    categoryStatus: z.enum(["active", "inactive"]),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type CategoryApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof CategoryApiResponse> | null;
};

// All the categories api response
export type AllCategoriesApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof CategoryApiResponse>[] | null;
};