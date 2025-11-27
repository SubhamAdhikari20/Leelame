// src/types/common-role.type.ts
import { z } from "zod";

export const fullNameValidation = z
    .string()
    .min(3, { message: "Name must be atleast 3 characters long" })
    .max(20, { message: "Name must not exceed 20 characters" })
    .regex(/^[a-zA-Z ]+$/, { message: "Name must contain only alphabets and spaces" });

export const contactValidation = z
    .string()
    .min(10, { message: "Contact must be 10 digits long" })
    .max(10, { message: "Contact must be 10 digits long" })
    .regex(/^[0-9]+$/, { message: "Contact must contain only digits" });

export const passwordValidation = z
    .string()
    .min(8, { message: "Password must be atleast 8 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, { message: "Password must contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character" });

export const bioValidation = z
    .string()
    .min(5, { message: "Bio must be atleast 5 characters long" })
    .max(500, { message: "Bio must not exceed 500 characters" })
    .optional()
    .nullish();

export const termsAndConditionsValidation = z
    .literal(true, { message: "You must accept the terms and conditions" });