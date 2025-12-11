// src/schemas/message-contact.schema.ts
import { z } from "zod";
import { fullNameValidation, emailValidation, contactValidation } from "./user.schema.ts";

const messageValidation = z
    .string()
    .min(5, { message: "Message must be atleast 3 characters long" })
    .max(100, { message: "Message must be atleast 100 characters long" })
    .regex(/^[a-zA-Z ]+$/, { message: "Message must contain only alphabets and spaces" });


export const messageContactSchema = z.object({
    fullName: fullNameValidation,
    // username: usernameValidation,
    email: emailValidation,
    contact: contactValidation,
    message: messageValidation,
});