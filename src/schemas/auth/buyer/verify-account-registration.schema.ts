// src/schemas/auth/buyer/verify-account-registration.schema.ts
import { z } from "zod";
import { otpValidation } from "../../user.schema.ts";

export const VerifyAccountRegistrationSchema = z.object({
    otp: otpValidation
});

export type VerifyAccountRegistrationSchemaType = z.infer<typeof VerifyAccountRegistrationSchema>;