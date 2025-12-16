// src/schemas/auth/seller/login.schema.js
import { z } from "zod";

const sellerIdentifierValidation = z
    .string()
    .min(3, { message: "Email or Contact is required" });

const passwordValidation = z
    .string()
    .min(1, { message: "Password is required" });

const roleValidation = z
    .enum(["admin", "seller", "buyer"], {
        error: "Role is required"
    }).optional();

export const sellerLoginSchema = z.object({
    // Identifier = Email OR Contact
    identifier: sellerIdentifierValidation,
    password: passwordValidation,
    role: roleValidation
});