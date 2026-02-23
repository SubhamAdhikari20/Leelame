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


// -------------------------------- Product Condition Api Response -------------------------------
// Product Condition Api Response
export const ProductConditionApiResponse = z.object({
    _id: z.string(),
    productConditionName: z.string(),
    description: z.string().nullish(),
    productConditionEnum: z.enum(["NEW", "NEW_OTHER", "NEW_WITH_DEFECTS", "CERTIFIED_REFURBISHED", "EXCELLENT_REFURBISHED", "VERY_GOOD_REFURBISHED", "GOOD_REFURBISHED", "SELLER_REFURBISHED", "LIKE_NEW", "PRE_OWNED_EXCELLENT", "USED_EXCELLENT", "PRE_OWNED_FAIR", "USED_VERY_GOOD", "USED_GOOD", "USED_ACCEPTABLE", "FOR_PARTS_OR_NOT_WORKING"]).default("NEW"),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type ProductConditionApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof ProductConditionApiResponse> | null;
};

// All the product conditions api response
export type AllProductConditionsApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof ProductConditionApiResponse>[] | null;
};


// -------------------------------- Product Api Response -------------------------------
// Product Api Response
export const ProductApiResponse = z.object({
    _id: z.string(),
    productName: z.string(),
    description: z.string().nullish(),
    commission: z.number(),
    startPrice: z.number(),
    currentBidPrice: z.number(),
    bidIntervalPrice: z.number(),
    endDate: z.date(),
    productImageUrls: z.array(z.string()),
    isVerified: z.boolean(),
    isSoldOut: z.boolean(),
    sellerId: z.string(),
    categoryId: z.string(),
    conditionId: z.string(),
    soldToBuyerId: z.string().nullish(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type ProductApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof ProductApiResponse> | null;
};

// All the categories api response
export type AllProductsApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof ProductApiResponse>[] | null;
};


// --------------------------------- Bid Api Response ---------------------------------
// Bid Api Response
export const BidApiResponse = z.object({
    _id: z.string(),
    productId: z.string(),
    buyerId: z.string(),
    bidAmount: z.number(),
    createdAt: z.date().nullish(),
    updatedAt: z.date().nullish(),
});

export type BidApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof BidApiResponse> | null;
};

export type AllBidsApiResponseType = {
    success: boolean;
    message: string;
    status?: number | null;
    data?: z.infer<typeof BidApiResponse>[] | null;
};