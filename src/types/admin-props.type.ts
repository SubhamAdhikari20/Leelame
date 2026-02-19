// src/type/admin-props.type.ts
import { z } from "zod";
import { SellerApiResponse, CategoryApiResponse, ProductConditionApiResponse } from "./api-response.type.ts";
import type { CurrentUserType } from "./current-user.type.ts";


// All Sellers list in Admin Workspace
export type ListSellerPropsType = {
    currentUser?: CurrentUserType | null;
    sellers?: z.infer<typeof SellerApiResponse>[] | null;
};

// Update Seller Account Details in Admin Workspace
export type UpdateSellerProfileDetailsPropsType = {
    currentUser?: CurrentUserType | null;
    seller: z.infer<typeof SellerApiResponse>;
};

// All Categories list in Admin Workspace
export type ListCategoriesPropsType = {
    currentUser?: CurrentUserType | null;
    categories?: z.infer<typeof CategoryApiResponse>[] | null;
};

// Update Category Details in Admin Workspace
export type UpdateCategoryDetailsPropsType = {
    currentUser?: CurrentUserType | null;
    category: z.infer<typeof CategoryApiResponse>;
};

// All Product Conditions list in Admin Workspace
export type ListProductConditionsPropsType = {
    currentUser?: CurrentUserType | null;
    productConditions?: z.infer<typeof ProductConditionApiResponse>[] | null;
};

// Update Product Category Details in Admin Workspace
export type UpdateProductConditionDetailsPropsType = {
    currentUser?: CurrentUserType | null;
    productCondition: z.infer<typeof ProductConditionApiResponse>;
};