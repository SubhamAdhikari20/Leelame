// src/schemas/buyer/update-profile-details.schemats
import { z } from "zod";
import { fullNameValidation, usernameValidation, emailValidation, contactValidation } from "../user.schema.ts";


export const UpdateProfileDetailsSchema = z.object({
    fullName: fullNameValidation,
    username: usernameValidation,
    email: emailValidation,
    contact: contactValidation,
});
export type UpdateProfileDetailsSchemaType = z.infer<typeof UpdateProfileDetailsSchema>;