// src/schemas/auth/seller/verify-account-reset-password.schema.ts
import { z } from "zod";
import { otpValidation, passwordValidation, confirmPasswordValidation } from "../../user.schema.ts";

export const SellerResetPasswordSchema = z.object({
    otp: otpValidation,
    newPassword: passwordValidation,
    confirmPassword: confirmPasswordValidation
}).superRefine((values, ctx) => {
    if (values.newPassword !== values.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});
export type SellerResetPasswordSchemaType = z.infer<typeof SellerResetPasswordSchema>;