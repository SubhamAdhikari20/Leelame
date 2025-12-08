// src/dtos/admin.dto.ts
import { z } from "zod";
import { adminSchema } from "@/types/admin.type.ts";
import { emailValidation, roleValidation } from "@/schemas/user.schema.ts";


// Create Admin DTO
export const CreatedAdminDto = adminSchema.extend({
    email: emailValidation,
    role: roleValidation
});
export type CreatedAdminDtoType = z.infer<typeof CreatedAdminDto>;