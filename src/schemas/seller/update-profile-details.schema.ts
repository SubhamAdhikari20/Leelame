// src/schemas/seller/update-profile-details.schema.ts
import { z } from "zod";
import { fullNameValidation, emailValidation, contactValidation } from "../user.schema.ts";


export const UpdateProfileDetailsSchema = z.object({
    fullName: fullNameValidation,
    email: emailValidation,
    contact: contactValidation,
});
export type UpdateProfileDetailsSchemaType = z.infer<typeof UpdateProfileDetailsSchema>;