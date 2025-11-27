// src/types/api-response.ts
import { IUser } from "@/models/user.model.ts";
import { IBuyer } from "@/models/buyer.model.ts";
import { ISeller } from "@/models/seller.model.ts";
import { IAdmin } from "@/models/admin.model";

export type UserResponse =
    | (IUser & { role: "buyer"; buyerProfile: IBuyer })
    | (IUser & { role: "seller"; sellerProfile: ISeller })
    | (IUser & { role: "admin"; adminProfile: IAdmin });

export interface ApiResponse {
    success: boolean;
    message: string;
    status?: number | null;
    user?: UserResponse | null;
}