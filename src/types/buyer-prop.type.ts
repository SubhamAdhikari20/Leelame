// src/type/buyer-props.type.ts
import { z } from "zod";
import { OrderApiResponse, InvoiceApiResponse, CategoryApiResponse, ProductApiResponse, SellerApiResponse, ProductConditionApiResponse, BidApiResponse } from "./api-response.type.ts";
import type { CurrentUserType } from "./current-user.type.ts";


export type CheckoutPagePropsType = {
    currentUser?: CurrentUserType | null;
    order: z.infer<typeof OrderApiResponse>;
};

export type ReceiptPagePropsType = {
    currentUser?: CurrentUserType | null;
    invoice: z.infer<typeof InvoiceApiResponse>;
    isSuccess: boolean;
    // transactionId: string;
    // status: string;
};

export type InvoiceProps = {
    invoice: z.infer<typeof InvoiceApiResponse>;
};

export type MyBidsPagePropsType = {
    currentUser?: CurrentUserType | null;
    bids: z.infer<typeof BidApiResponse>[];
    categories: z.infer<typeof CategoryApiResponse>[];
    products: z.infer<typeof ProductApiResponse>[];
    sellers: z.infer<typeof SellerApiResponse>[];
    productConditions?: z.infer<typeof ProductConditionApiResponse>[];
};