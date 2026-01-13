// src/schemas/auth/seller/reset-password.schema.ts.ts
import { z } from "zod";
import { otpValidation, passwordValidation, confirmPasswordValidation } from "../../user.schema.ts";

export const SellerVerifyAccountRegistrationSchema = z.object({
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
export type SellerVerifyAccountRegistrationSchemaType = z.infer<typeof SellerVerifyAccountRegistrationSchema>;


export const SellerVerifyAccountRegistrationFromVerifyDialogBoxFromLoginSchema = z.object({
    otp: otpValidation
});
export type SellerVerifyAccountRegistrationFromVerifyDialogBoxFromLoginSchemaType = z.infer<typeof SellerVerifyAccountRegistrationFromVerifyDialogBoxFromLoginSchema>;