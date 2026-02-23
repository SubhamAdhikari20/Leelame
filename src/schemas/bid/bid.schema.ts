// src/schemas/bid/bid.schema.ts
import { z } from "zod";


export const bidAmountValidation = z
    .number()
    .min(0, { message: "Bid Amount must be a positive number" });

// export const quantityValidation = z
//     .number()
//     .int({ message: "Quantity must be an integer" })
//     .positive({ message: "Quantity must be a positive number" })
//     .min(1, { message: "Quantity must be at least 1" })