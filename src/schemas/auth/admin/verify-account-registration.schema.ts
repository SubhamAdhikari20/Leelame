// src/schemas/auth/admin/verify-account-registration.schema.ts
import { z } from "zod";
import { otpValidation } from "../../user.schema.ts";

export const AdminVerifyAccountRegistrationSchema = z.object({
    otp: otpValidation
});
export type AdminVerifyAccountRegistrationSchemaType = z.infer<typeof AdminVerifyAccountRegistrationSchema>;