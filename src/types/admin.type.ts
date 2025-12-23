// src/types/admin.type.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, passwordValidation } from "@/schemas/user.schema.ts";
import { IAdmin } from "@/models/admin.model.ts";


export const adminSchema = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    password: passwordValidation,
    userId: z.string(),
});

export type Admin = z.infer<typeof adminSchema>;

export type AdminDocument = IAdmin;