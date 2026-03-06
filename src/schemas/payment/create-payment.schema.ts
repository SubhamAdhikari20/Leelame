// src/scemas/payment/create-payment.schema.ts
import { z } from "zod";
import { amountValidation, methodValidation, statusValidation } from "./payment.schema.ts";


export const CreatePaymentSchema = z.object({
    orderId: z.string(),
    transactionId: z.string(),
    amount: amountValidation,
    method: methodValidation,
    status: statusValidation,
});
export type CreatePaymentSchemaType = z.infer<typeof CreatePaymentSchema>;

const InitiatePaymentSchema = z.object({
    orderId: z.string(),
    amount: amountValidation,
    method: methodValidation,
    status: statusValidation,
});
export type InitiatePaymentSchemaType = z.infer<typeof InitiatePaymentSchema>;