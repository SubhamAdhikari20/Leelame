// src/schemas/auth/seller/sign-up.schema.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, emailValidation, roleValidation } from "../../user.schema.ts";

export const sellerSignUpSchema = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    email: emailValidation,
    role: roleValidation
});