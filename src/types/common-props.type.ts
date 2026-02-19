// src/type/common-props.type.ts
import { z } from "zod";
import { CategoryApiResponse, ProductApiResponse, SellerApiResponse } from "./api-response.type.ts";
import type { CurrentUserType } from "./current-user.type.ts";


// All Products lists
export type ProductListingPropsType = {
    currentUser?: CurrentUserType | null;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    products?: z.infer<typeof ProductApiResponse>[] | null;
    sellers?: z.infer<typeof SellerApiResponse>[] | null;
};

export type ProductCardPropsType = {
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    category: z.infer<typeof CategoryApiResponse>;
    seller: z.infer<typeof SellerApiResponse>;
    onBid: () => void;
    onToggleFavourite?: (product: z.infer<typeof ProductApiResponse>, isFavourite: boolean) => void;
}