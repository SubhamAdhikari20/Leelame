// src/schemas/product/create-product.schema.ts
import { z } from "zod";
import { productNameValidation, productDescriptionValidation, productStartPriceValidation, productBidIntervalPriceValidation } from "./product.schema.ts";


// Create Product Schema
export const CreateProductSchema = z.object({
    productName: productNameValidation,
    description: productDescriptionValidation,
    startPrice: productStartPriceValidation,
    bidIntervalPrice: productBidIntervalPriceValidation,
    endDate: z.date(),
    categoryId: z.string().min(1, { message: "Select a category of the product" })
});
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;