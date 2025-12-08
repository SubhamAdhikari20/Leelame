// src/dtos/seller.dto.ts
import { z } from "zod";
import { sellerSchema } from "@/types/seller.type.ts";
import { emailValidation, roleValidation } from "@/schemas/user.schema.ts";


// Create Seller DTO
export const CreatedSellerDto = sellerSchema.extend({
    email: emailValidation,
    role: roleValidation
});
export type CreatedSellerDtoType = z.infer<typeof CreatedSellerDto>;