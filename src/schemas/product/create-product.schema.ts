// src/schemas/product/create-product.schema.ts
import { z } from "zod";
import { productNameValidation, productDescriptionValidation, productStartPriceValidation, productBidIntervalPriceValidation } from "./product.schema.ts";


// Create Product Schema
export const CreateProductSchema = z.object({
    productName: productNameValidation,
    description: productDescriptionValidation.nullish(),
    startPrice: productStartPriceValidation,
    bidIntervalPrice: productBidIntervalPriceValidation,
    endDate: z.date(),
    categoryId: z.string()
});
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;