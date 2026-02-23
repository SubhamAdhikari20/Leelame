// src/schemas/bid/update-bid.schema.ts
import { z } from "zod";
import { bidAmountValidation } from "./bid.schema.ts";


// Update Bid Schema
export const UpdateBidSchema = z.object({
    productId: z.string(),
    buyerId: z.string(),
    bidAmount: bidAmountValidation
});
export type UpdateBidSchemaType = z.infer<typeof UpdateBidSchema>;