// src/schemas/auth/seller/sign-up.schema.ts
import { z } from "zod";
import { emailValidation, roleValidation } from "../../user.schema.ts";

export const sellerSignUpSchema = z.object({
    email: emailValidation,
    role: roleValidation
});