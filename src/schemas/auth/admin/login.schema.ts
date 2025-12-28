// src/schemas/auth/seller/login.schema.ts
import { z } from "zod";

const adminIdentifierValidation = z
    .string()
    .min(3, { message: "Email or Contact is required" });

const passwordValidation = z
    .string()
    .min(1, { message: "Password is required" });

const roleValidation = z
    .enum(["admin", "seller", "buyer"], {
        error: "Role is required"
    }).optional();

export const adminLoginSchema = z.object({
    // Identifier = Email OR Contact
    identifier: adminIdentifierValidation,
    password: passwordValidation,
    role: roleValidation
});