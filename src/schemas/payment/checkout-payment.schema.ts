// src/scemas/payment/checkout-payment.schema.ts
import { z } from "zod";
import { amountValidation, methodValidation, statusValidation } from "./payment.schema.ts";


export const CheckoutPaymentSchema = z.object({
    orderId: z.string(),
    method: methodValidation,
    totalPrice: amountValidation,
    status: statusValidation,
});
export type CheckoutPaymentSchemaType = z.infer<typeof CheckoutPaymentSchema>;