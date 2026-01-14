// src/schemas/auth/admin/verify-account-reset-password.schema.ts
import { z } from "zod";

const verifyCodeResetPasswordSchema = z
    .string()
    .length(6, { message: "Verification code must be 6 characters long" })
    .regex(/^[0-9]+$/, { message: "Verification code must contain only digits" })

export const AdminVerifyAccountResetPasswordSchema = z.object({
    otp: verifyCodeResetPasswordSchema
});
export type AdminVerifyAccountResetPasswordSchemaType = z.infer<typeof AdminVerifyAccountResetPasswordSchema>;