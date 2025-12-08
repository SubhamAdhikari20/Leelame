// src/schemas/auth/sign-up.schema.ts
import { z } from "zod";
import { fullNameValidation, usernameValidation, contactValidation, emailValidation, passwordValidation, roleValidation } from "../user.schema.ts";

const confirmPasswordValidation = z
    .string()
    .min(8, { message: "Confirm Password must be atleast 8 characters long" })
    .max(20, { message: "Confirm Password must not exceed 20 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, { message: "Confirm Password must contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character" });

const termsAndConditionsValidation = z
    .boolean().refine((value) => value === true, {
        message: "You must accept the terms and conditions"
    });


// Sign Up Schema for Buyers
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