// src/schemas/bid/create-bid.schema.ts
import { z } from "zod";
import { bidAmountValidation } from "./bid.schema.ts";


// Create Bid Schema
export const CreateBidSchema = z.object({
    productId: z.string(),
    buyerId: z.string(),
    bidAmount: bidAmountValidation
});
export type CreateBidSchemaType = z.infer<typeof CreateBidSchema>;