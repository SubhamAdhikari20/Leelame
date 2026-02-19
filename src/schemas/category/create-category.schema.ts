// src/schemas/category/create-category.schema.ts
import { z } from "zod";
import { categoryNameValidation, categoryDescriptionValidation, categoryStatusValidation } from "./category.schema.ts";


// Create Category Schema
export const CreateCategorySchema = z.object({
    categoryName: categoryNameValidation,
    description: categoryDescriptionValidation.nullish(),
    categoryStatus: categoryStatusValidation,
});
export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;