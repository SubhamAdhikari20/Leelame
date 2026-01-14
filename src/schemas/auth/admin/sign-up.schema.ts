// src/schemas/auth/admin/sign-up.schema.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, emailValidation, passwordValidation, confirmPasswordValidation, roleValidation } from "../../user.schema.ts";


export const AdminSignUpSchema = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
    role: roleValidation,
}).superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});
export type AdminSignUpSchemaType = z.infer<typeof AdminSignUpSchema>;