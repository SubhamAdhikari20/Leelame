// src/schemas/auth/seller/login.schema.ts
import { z } from "zod";
import { emailValidation } from "@/schemas/user.schema.ts";


const passwordValidation = z
    .string()
    .min(1, { message: "Password is required" });

const roleValidation = z
    .enum(["admin", "seller", "buyer"], {
        error: "Role is required"
    }).optional();

export const AdminLoginSchema = z.object({
    identifier: emailValidation,
    password: passwordValidation,
    role: roleValidation
});
export type AdminLoginSchemaType = z.infer<typeof AdminLoginSchema>;