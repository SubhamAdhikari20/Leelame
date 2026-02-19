// src/schemas/product/update-product.schema.ts
import { z } from "zod";
import { productNameValidation, productDescriptionValidation, productStartPriceValidation, productBidIntervalPriceValidation } from "./product.schema.ts";


// Update Product Schema
export const UpdateProductSchema = z.object({
    productName: productNameValidation,
    description: productDescriptionValidation.nullish(),
    startPrice: productStartPriceValidation,
    bidIntervalPrice: productBidIntervalPriceValidation,
    endDate: z.date(),
    removedExisitingProductImageUrls: z.array(z.string()),
    categoryId: z.string(),
    conditionId: z.string(),
});
export type UpdateProductSchemaType = z.infer<typeof UpdateProductSchema>;