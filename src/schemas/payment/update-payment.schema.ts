// src/scemas/payment/update-payment.schema.ts
import { z } from "zod";
import { amountValidation, methodValidation, statusValidation } from "./payment.schema.ts";


export const UpdatePaymentDetailsSchema = z.object({
    orderId: z.string(),
    transactionId: z.string(),
    amount: amountValidation,
    method: methodValidation,
    status: statusValidation,
});
export type UpdatePaymentDetailsSchemaType = z.infer<typeof UpdatePaymentDetailsSchema>;


export const UpdatePaymentStatusSchema = z.object({
    status: statusValidation,
});
export type UpdatePaymentStatusSchemaType = z.infer<typeof UpdatePaymentStatusSchema>;