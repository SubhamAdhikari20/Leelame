// frontend/src/schemas/auth/forgot-password-schema.ts
import { z } from "zod";

const forgotPasswordValidation = z
    .email({ message: "Invalid Email Address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(50, { message: "Email must not exceed 50 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address" });

export const forgotPasswordSchema = z.object({
    email: forgotPasswordValidation
});