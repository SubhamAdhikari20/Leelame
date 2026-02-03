// src/type/admin-props.type.ts
import { z } from "zod";
import { SellerApiResponse } from "./api-response.type.ts";
import type { CurrentUserType } from "./current-user.type.ts";


// All Sellers list in Admin Workspace
export type ListSellerPropsType = {
    currentUser?: CurrentUserType | null;
    sellers?: z.infer<typeof SellerApiResponse>[] | null;
};

// Update Seller Account Details in Admin Workspace
export type UpdateSellerProfileDetailsPropsType = {
    currentUser?: CurrentUserType | null;
    seller?: z.infer<typeof SellerApiResponse> | null;
};