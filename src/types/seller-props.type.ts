// src/type/admin-props.type.ts
import { z } from "zod";
import type { CurrentUserType } from "./current-user.type.ts";


// All Products list in Seller Workspace
export type ListProductsPropsType = {
    currentUser?: CurrentUserType | null;
    products?: any | null;
};