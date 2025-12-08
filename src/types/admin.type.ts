// src/types/admin.type.ts
import { z } from "zod";
import { fullNameValidation, contactValidation, passwordValidation } from "@/schemas/user.schema.ts";


export const adminSchema = z.object({
    fullName: fullNameValidation,
    contact: contactValidation,
    password: passwordValidation,
    userId: z.string(),
});

export type Admin = z.infer<typeof adminSchema>;

export type AdminDocument = Admin & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
};