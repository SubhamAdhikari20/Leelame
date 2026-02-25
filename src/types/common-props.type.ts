// src/type/common-props.type.ts
import { z } from "zod";
import { CategoryApiResponse, ProductApiResponse, SellerApiResponse, ProductConditionApiResponse } from "./api-response.type.ts";
import type { CurrentUserType } from "./current-user.type.ts";


// All Products lists
export type ProductListingPropsType = {
    currentUser?: CurrentUserType | null;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    products?: z.infer<typeof ProductApiResponse>[] | null;
    sellers?: z.infer<typeof SellerApiResponse>[] | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
};

export type ProductCardPropsType = {
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    category: z.infer<typeof CategoryApiResponse>;
    seller: z.infer<typeof SellerApiResponse>;
    productCondition: z.infer<typeof ProductConditionApiResponse>;
    onBid: () => void;
    onToggleFavourite?: (product: z.infer<typeof ProductApiResponse>, isFavourite: boolean) => void;
};

// View Details Product in Piblic
export type ProductViewDetailsPublicPropsType = {
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    seller: z.infer<typeof SellerApiResponse>;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
};

export type ProductPropsType = {
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    seller: z.infer<typeof SellerApiResponse>;
    category: z.infer<typeof CategoryApiResponse>;
    condition: z.infer<typeof ProductConditionApiResponse>;
};

export type BidDialogBoxPublicPropsType = {
    open: boolean;
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    seller: z.infer<typeof SellerApiResponse>;
    // category: z.infer<typeof CategoryApiResponse>;
    // condition: z.infer<typeof ProductConditionApiResponse>;
    onOpenChange: (bool: boolean) => void;
    // onPlaceBid: (data: any) => void;
};