// frontend/src/schemas/auth/loginSchema.js
import { z } from "zod";

const buyerIdentifierValidation = z
    .string()
    .min(3, { message: "Username or Email is required" });

const passwordValidation = z
    .string()
    .min(1, { message: "Password is required" });

const roleValidation = z
    .enum(["admin", "seller", "buyer"], {
        error: "Role is required"
    });

export const buyerLoginSchema = z.object({
    // Identifier = Username OR Email
    identifier: buyerIdentifierValidation,
    password: passwordValidation,
    role: roleValidation
});