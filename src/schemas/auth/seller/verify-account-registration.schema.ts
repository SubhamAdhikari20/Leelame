// src/schemas/auth/seller/reset-password.schema.ts.ts
import { z } from "zod";
import { otpValidation, passwordValidation, confirmPasswordValidation } from "../../user.schema.ts";

export const sellerVerifyAccountRegistrationSchema = z.object({
    otp: otpValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation
}).superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});

export const sellerVerifyAccountRegistrationFromVerifyDialogBoxFromLoginSchema = z.object({
    otp: otpValidation
});