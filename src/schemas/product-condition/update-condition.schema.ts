// src/schemas/product-condition/update-condition.schema.ts
import { z } from "zod";
import { productConditionNameValidation, productConditionDescriptionValidation, productConditionEnumValidation } from "./condition.schema.ts";


// Update Product Condition Schema
export const UpdateProductConditionSchema = z.object({
    productConditionName: productConditionNameValidation,
    description: productConditionDescriptionValidation.nullish(),
    productConditionEnum: productConditionEnumValidation,
});
export type UpdateProductConditionSchemaType = z.infer<typeof UpdateProductConditionSchema>;