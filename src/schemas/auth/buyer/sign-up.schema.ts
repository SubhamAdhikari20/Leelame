// src/schemas/auth/buyer/sign-up.schema.ts
import { z } from "zod";
import { fullNameValidation, usernameValidation, contactValidation, emailValidation, passwordValidation, confirmPasswordValidation, roleValidation } from "../../user.schema.ts";


const termsAndConditionsValidation = z
    .boolean().refine((value) => value === true, {
        message: "You must accept the terms and conditions"
    });

export const buyerSignUpSchema = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
    contact: contactValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
    role: roleValidation,
    terms: termsAndConditionsValidation
}).superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});