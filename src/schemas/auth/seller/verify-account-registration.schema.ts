// src/schemas/auth/seller/verify-account-registration.schema.ts
import { z } from "zod";
import { otpValidation, passwordValidation, confirmPasswordValidation } from "../../user.schema.ts";

export const sellerVerifyAccountRegistrationSchema = z.object({
    code: otpValidation,
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