// src/schemas/admin/manage-seller-account.schema.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, emailValidation, roleValidation, passwordValidation, confirmPasswordValidation } from "../user.schema.ts";


export const CreateSellerAccountSchema = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
    role: roleValidation
});
export type CreateSellerAccountSchemaType = z.infer<typeof CreateSellerAccountSchema>;


export const UpdateSellerAccountSchema = z.object({
    fullName: fullNameValidation.optional(),
    contact: contactValidation.optional(),
    email: emailValidation.optional(),
});
export type UpdateSellerAccountSchemaType = z.infer<typeof UpdateSellerAccountSchema>;