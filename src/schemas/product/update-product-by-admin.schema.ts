// src/schemas/product/update-product-by-admin.schema.ts
import { z } from "zod";
import { productCommissionValidation } from "./product.schema.ts";


// Note thea admin can only update to verify the product and set commission (%).
// Update Product Schema
export const UpdateProductByAdminSchema = z.object({
    commission: productCommissionValidation,
    isVerified: z.boolean(),
});
export type UpdateProductByAdminSchemaType = z.infer<typeof UpdateProductByAdminSchema>;