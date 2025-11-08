// src/schemas/auth/sign-up-schema.ts
import { z } from 'zod';

const fullNameValidation = z     // Full Name validation
    .string()
    .min(3, { message: "Name must be atleast 3 characters long" })
    .max(20, { message: "Name must not exceed 20 characters" })
    .regex(/^[a-zA-Z ]+$/, { message: "Name must contain only alphabets and spaces" });


const usernameValidation = z     // Username validation
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must not contain special characters" });


const emailValidation = z    // Email validation
    .email({ message: "Inavild email address" })
    .min(5, { message: "Email must be atleast 5 characters long" })
    .max(50, { message: "Email must not exceed 50 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address" });


const passwordValidation = z     // Password validation
    .string()
    .min(8, { message: "Password must be atleast 8 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, { message: "Password must contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character" });

const confirmPasswordValidation = z     // Confirm Password validation
    .string()
    .min(8, { message: "Confirm Password must be atleast 8 characters long" })
    .max(20, { message: "Confirm Password must not exceed 20 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, { message: "Confirm Password must contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character" });

const contactValidation = z      // Contact validation
    .string()
    .min(10, { message: "Contact must be 10 digits long" })
    .max(10, { message: "Contact must be 10 digits long" })
    .regex(/^[0-9]+$/, { message: "Contact must contain only digits" });

const roleValidation = z        // Role validation
    .enum(["admin", "seller", "buyer"], {
        error: "Role is required"
    });

// const roleValidation = z        // Role validation
//     .array(z.enum(["admin", "seller", "buyer"]))
//     .nonempty({ message: "At least one role must be selected" })
//     .default(["buyer"]);

// const termsAndConditionsValidation = z       // Terms and Conditions validation
//     .literal(true, { message: "You must accept the terms and conditions" });

const termsAndConditionsValidation = z       // Terms and Conditions validation
    .boolean().refine((value) => value === true, {
        message: "You must accept the terms and conditions"
    });

export const buyerSignUpSchema = z.object({    // Sign Up Schema
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

export const usernameQuerySchema = z.object({
    username: usernameValidation
});