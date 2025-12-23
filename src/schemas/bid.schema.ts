// src/schemas/bid.schema.ts
import { z } from "zod";

const bidAmountValidation = z
    .number()
    .positive({ message: "Bid amount must be a positive number" })
// .min(1, { message: "Bid amount must be at least 1" })

const quantityValidation = z
    .number()
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be a positive number" })
    .min(1, { message: "Quantity must be at least 1" })

export const bidSchema = z.object({
    bidAmount: bidAmountValidation,
    quantity: quantityValidation,
});