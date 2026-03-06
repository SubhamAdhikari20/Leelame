// src/schemas/order/create-order.schema.ts
import { z } from "zod";
import { delivaryAddressValidation, delivaryDateValidation, totalPriceValidation, statusValidation } from "./order.schema.ts";


export const UpdateOrderDetailsSchema = z.object({
    productId: z.string(),
    buyerId: z.string(),
    sellerId: z.string(),
    delivaryAddress: delivaryAddressValidation,
    delivaryDate: delivaryDateValidation,
    totalPrice: totalPriceValidation,
    status: statusValidation,
}).refine((o) => o.delivaryDate > new Date(), {
    message: "Delivery date must be in the future",
    path: ["delivaryDate"],
});
export type UpdateOrderDetailsSchemaType = z.infer<typeof UpdateOrderDetailsSchema>;


export const UpdateOrderStatusSchema = z.object({
    status: statusValidation,
});
export type UpdateOrderStatusSchemaType = z.infer<typeof UpdateOrderStatusSchema>;