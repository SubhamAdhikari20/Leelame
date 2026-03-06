// src/components/buyer/buy-now-dialog.tsx
"use client";
import React, { startTransition, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog.tsx";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { handleCreateOrder } from "@/lib/actions/order/order.action.ts";
import { CreateOrderSchema, type CreateOrderSchemaType } from "@/schemas/order/create-order.schema.ts";
import type { BuyNowDialogBoxPublicPropsType } from "@/types/common-props.type.ts";


const BuyNowDialog = ({ currentUser, product, seller, open, onOpenChange }: BuyNowDialogBoxPublicPropsType) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
    const [pendingData, setPendingData] = useState<CreateOrderSchemaType | null>(null);

    const buyNowForm = useForm<CreateOrderSchemaType>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: {
            productId: product._id,
            buyerId: currentUser?._id,
            sellerId: seller._id || product.sellerId,
            delivaryAddress: "",
            delivaryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Default to 2 days from now
            totalPrice: Number(product.buyNowPrice) || 0,
            status: "pending",
        }
    });

    useEffect(() => {
        if (open && product) {
            buyNowForm.reset({
                productId: product._id,
                buyerId: currentUser?._id,
                sellerId: seller._id || product.sellerId,
                delivaryAddress: "",
                delivaryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Default to 2 days from now
                totalPrice: Number(product.buyNowPrice) || 0,
                status: "pending",
            });
        }
    }, [open, product, currentUser, seller, buyNowForm]);

    const buyNowAmount = Number(buyNowForm.watch("totalPrice")) || 0;
    const commissionRate = Number(product.commission) || 0;
    const serviceFee = buyNowAmount * (commissionRate / 100);
    const totalPayableAmount = buyNowAmount + serviceFee;

    const handleBuyNowFormSubmit = (data: CreateOrderSchemaType) => {
        setPendingData(data);
        setShowConfirmDialogBox(true);
    };

    const handleBuyNow = async () => {
        setShowConfirmDialogBox(false);

        if (!pendingData || !product) {
            toast.error("Data Error!", {
                description: "The pending bid and product data is not available."
            });
            return;
        }

        setIsSubmitting(true);

        try {
            if (!currentUser) {
                toast.error("Authentication Error!", {
                    description: "Please, login to place a bid."
                });

                setPendingData(null);
                setShowConfirmDialogBox(false);
                setIsSubmitting(false);
                onOpenChange(false);
                startTransition(() => router.push("/login"));
                return;
            }

            const response = await handleCreateOrder({ ...pendingData, totalPrice: totalPayableAmount });
            if (!response.success || !response.data) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });

            startTransition(() => router.replace(`/payment/checkout/${response.data._id}`));
            onOpenChange(false);
        }
        catch (error: Error | any) {
            console.error("Error in buying now: ", error);
            toast.error("Error in buying now", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const formatAmount = (amount: number) => {
        const format = Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });
        return `Rs. ${format}`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl! w-full max-h-[90vh] overflow-y-auto p-0 rounded-lg">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>Buy Now</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4 mb-2">
                    {/* Left: Product Description */}
                    <div className="space-y-4">
                        <div className="relative w-full h-44 rounded-md overflow-hidden bg-gray-100">
                            {product && product.productImageUrls && product.productImageUrls.length > 0 ? (
                                <Image
                                    src={product.productImageUrls[0]}
                                    alt={product.productName || "Product"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div>
                                    {(product.productName || "NaN")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">{product.productName}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                by{" "}
                                <span className="font-medium">
                                    {seller.fullName}
                                </span>
                            </p>
                        </div>
                    </div>

                    <form
                        id="buy-now-form"
                        onSubmit={buyNowForm.handleSubmit(handleBuyNowFormSubmit)}
                    >
                        <div className="flex flex-col gap-5 justify-between w-full h-full">
                            <div className="space-y-6">
                                <FieldGroup>
                                    <Controller
                                        name="delivaryAddress"
                                        control={buyNowForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Delivery Address
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Enter your delivery address"
                                                    autoComplete="off"
                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-2 space-y-1">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div>Delivary Date</div>
                                        <div>
                                            {format(buyNowForm.watch("delivaryDate"), "PPP")}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div>Total Price</div>
                                        <div>
                                            {buyNowAmount ? formatAmount(buyNowAmount) : "—"}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div>Service fee ({commissionRate}%)</div>
                                        <div>
                                            {buyNowAmount ? formatAmount(serviceFee) : "—"}
                                        </div>
                                    </div>
                                    <div className="flex justify-between font-semibold mt-2">
                                        <div>You will pay</div>
                                        <div>
                                            {buyNowAmount ? formatAmount(totalPayableAmount) : "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex flex-row gap-3 md:col-span-2">
                                <AlertDialog open={showConfirmDialogBox} onOpenChange={setShowConfirmDialogBox}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 text-white bg-green-600! hover:bg-green-500! dark:bg-green-600 dark:hover:bg-green-500"
                                        >
                                            {isSubmitting ? "Please wait..." : "Buy Now"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You are about to buy <strong className="text-foreground">{product.productName}</strong> for <strong className="text-foreground">{formatAmount(buyNowAmount)}</strong>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="text-white bg-green-600! hover:bg-green-500! dark:bg-green-600 dark:hover:bg-green-500"
                                                onClick={handleBuyNow}
                                            >
                                                {isSubmitting ? "Please wait..." : "Yes, Buy Now"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BuyNowDialog;