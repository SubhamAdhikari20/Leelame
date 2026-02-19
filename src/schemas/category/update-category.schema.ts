// src/schemas/category/update-category.schema.ts
import { z } from "zod";
import { categoryNameValidation, categoryDescriptionValidation, categoryStatusValidation } from "./category.schema.ts";


// Update Category Schema
export const UpdateCategorySchema = z.object({
    categoryName: categoryNameValidation,
    description: categoryDescriptionValidation.nullish(),
    categoryStatus: categoryStatusValidation,
});
export type UpdateCategorySchemaType = z.infer<typeof UpdateCategorySchema>;