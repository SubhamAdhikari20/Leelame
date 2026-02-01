// src/schemas/admin/update-profile-details.schema.ts
import { z } from "zod";
import { fullNameValidation, emailValidation, contactValidation } from "../user.schema.ts";


export const UpdateAdminProfileDetailsSchema = z.object({
    fullName: fullNameValidation,
    email: emailValidation,
    contact: contactValidation,
});
export type UpdateAdminProfileDetailsSchemaType = z.infer<typeof UpdateAdminProfileDetailsSchema>;