// src/schemas/product-condition/create-condition.schema.ts
import { z } from "zod";
import { productConditionNameValidation, productConditionDescriptionValidation, productConditionEnumValidation } from "./condition.schema.ts";


// Create Product Condition Schema
export const CreateProductConditionSchema = z.object({
    productConditionName: productConditionNameValidation,
    description: productConditionDescriptionValidation.nullish(),
    productConditionEnum: productConditionEnumValidation,
});
export type CreateProductConditionSchemaType = z.infer<typeof CreateProductConditionSchema>;