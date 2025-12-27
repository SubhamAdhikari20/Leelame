// src/schemas/buyer/update-user-details.schemats
import { z } from "zod";
import { fullNameValidation, usernameValidation, emailValidation, contactValidation } from "../user.schema.ts";

export const updateUserDetailsSchema = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
    email: emailValidation,
    contact: contactValidation,
});