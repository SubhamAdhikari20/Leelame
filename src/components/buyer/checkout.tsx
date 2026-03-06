// components/buyer/checkout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { CheckoutPaymentSchema, type CheckoutPaymentSchemaType } from "@/schemas/payment/checkout-payment.schema.ts";
import type { CheckoutPagePropsType } from "@/types/buyer-prop.type.ts";
import { handleInitiatePayment } from "@/lib/actions/payment/payment.action.ts";


const Checkout = ({ currentUser, order }: CheckoutPagePropsType) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkoutForm = useForm<CheckoutPaymentSchemaType>({
        resolver: zodResolver(CheckoutPaymentSchema),
        defaultValues: {
            orderId: order._id,
            totalPrice: order.totalPrice,
            method: "esewa",
            status: "pending",
        },
    });

    const onSubmit = async (data: CheckoutPaymentSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleInitiatePayment({
                orderId: data.orderId,
                amount: data.totalPrice,
                method: data.method,
                status: data.status,
            });

            if (!response.success || !response.data) {
                toast.error("Failed to initiate payment", {
                    description: response.message
                });
                return;
            }

            if (response.data.method === "khalti") {
                if (!response.paymentUrl) {
                    toast.error("Payment URL not found for Khalti", {
                        description: "Unable to proceed with Khalti payment."
                    });
                    return;
                }
                window.location.href = response.paymentUrl;
            }
            else {
                if (!response.formData || !response.paymentUrl) {
                    toast.error("Payment data not found for eSewa", {
                        description: "Unable to proceed with eSewa payment."
                    });
                    return;
                }
                // build and auto‐submit eSewa form
                const formEl = document.createElement("form");
                formEl.method = "POST";
                formEl.action = response.paymentUrl;
                Object.entries(response.formData).forEach(([key, val]) => {
                    const inp = document.createElement("input");
                    inp.type = "hidden";
                    inp.name = key;
                    inp.value = String(val);
                    formEl.appendChild(inp);
                });
                document.body.appendChild(formEl);
                formEl.submit();
            }
        }
        catch (error: Error | any) {
            toast.error("Error while initiating payment", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="flex items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Confirm Payment</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form
                        id="checkout-form"
                        onSubmit={checkoutForm.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Controller
                                name="orderId"
                                control={checkoutForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="hidden">
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Full Name"
                                            readOnly
                                        // autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="totalPrice"
                                control={checkoutForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Payment Method
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Total Price"
                                            disabled
                                        // autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="method"
                                control={checkoutForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Total Price
                                        </FieldLabel>
                                        <ToggleGroup
                                            type="single"
                                            value={field.value}
                                            onValueChange={(value) => {
                                                if (value) {
                                                    return field.onChange(value);
                                                }
                                            }}
                                            className="grid grid-cols-2 gap-4 w-full"
                                        >
                                            <ToggleGroupItem
                                                value="esewa"
                                                className="flex flex-col items-center justify-center h-32 p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-50"
                                            >
                                                <div className="relative w-full h-16">
                                                    <Image
                                                        src="/images/esewa.png"
                                                        alt="eSewa"
                                                        fill
                                                        className="object-fit object-cover"
                                                    />
                                                </div>
                                                {/* <span className="text-sm font-medium">eSewa</span> */}
                                            </ToggleGroupItem>

                                            <ToggleGroupItem
                                                value="khalti"
                                                className="w-full flex flex-col items-center justify-center h-32 p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition data-[state=on]:border-blue-600 data-[state=on]:bg-blue-50"
                                            >
                                                <div className="relative w-full h-16">
                                                    <Image
                                                        src="/images/khalti.png"
                                                        alt="Khalti"
                                                        fill
                                                        className="object-fit object-cover"
                                                    />
                                                </div>
                                                {/* <span className="text-sm font-medium">Khalti</span> */}
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <div className="w-full flex items-center justify-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-orange-500 hover:bg-orange-600 text-gray-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        Please wait...
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Pay Rs. {order.totalPrice}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="text-center text-xs text-gray-500">
                    <span>Secured by: <strong>Leelame</strong></span>
                </CardFooter>
            </Card>
        </section>
    );
};

export default Checkout;