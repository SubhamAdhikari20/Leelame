// src/schemas/auth/buyer/verify-account-registration.schema.ts
import { z } from "zod";
import { otpValidation } from "../../user.schema.ts";

export const verifyAccountRegistrationSchema = z.object({
    otp: otpValidation
});