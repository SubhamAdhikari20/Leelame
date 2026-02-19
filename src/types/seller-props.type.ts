// src/type/admin-props.type.ts
import { z } from "zod";
import { CategoryApiResponse, ProductApiResponse, ProductConditionApiResponse } from "./api-response.type.ts";
import type { CurrentUserType } from "./current-user.type.ts";


// All Products list in Seller Workspace
export type ListProductsPropsType = {
    currentUser?: CurrentUserType | null;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
    products?: z.infer<typeof ProductApiResponse>[] | null;
};

// Add Product in Seller Workspace
export type AddProductPropsType = {
    currentUser?: CurrentUserType | null;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
};

// Update Product in Seller Workspace
export type UpdateProductPropsType = {
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
};

// View Details Product in Seller Workspace
export type ProductViewDetailsPropsType = {
    currentUser?: CurrentUserType | null;
    product: z.infer<typeof ProductApiResponse>;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
};