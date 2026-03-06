// src/schemas/payment/finalize-payment.schema.ts
import { z } from "zod";
import { statusValidation } from "./payment.schema.ts";


// Finalize Payment With Esewa Schema
export const FinalizePaymentWithEsewaSchema = z.object({
    transactionId: z.string(),
    gatewayRef: z.string(),
    status: statusValidation,
});
export type FinalizePaymentWithEsewaSchemaType = z.infer<typeof FinalizePaymentWithEsewaSchema>;

// Finalize Payment With Khalti Schema
export const FinalizePaymentWithKhaltiSchema = z.object({
    transactionId: z.string(),
    gatewayRef: z.string(),
    status: statusValidation,
});
export type FinalizePaymentWithKhaltiSchemaType = z.infer<typeof FinalizePaymentWithKhaltiSchema>;