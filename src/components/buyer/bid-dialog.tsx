// src/components/buyer/bid-dialog.tsx
"use client";
import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog.tsx";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bidSchema } from "@/schemas/bid.schema.ts";
import * as z from "zod";


type BidDialogPropsType = {
    open: any;
    product: any;
    onOpenChange: (bool: boolean) => void;
    onPlaceBid: (data: any) => void;
}

const BidDialog = ({ open, onOpenChange, product, onPlaceBid }: BidDialogPropsType) => {
    const [placing, setPlacing] = useState(false);

    const bidForm = useForm({
        resolver: zodResolver(bidSchema),
        defaultValues: {
            bidAmount: 0,
            quantity: 1,
        },
    });

    // Compute total dynamically
    const bidAmount = Number(bidForm.watch("bidAmount")) || 0;
    const quantity = Number(bidForm.watch("quantity")) || 1;
    const total = useMemo(() => {
        return bidAmount * quantity;
    }, [bidAmount, quantity]);


    const handlePlaceBid = async (data: z.infer<typeof bidSchema>) => {
        if (!product) {
            return;
        }

        const bidAmount = Number(data.bidAmount);
        const quantity = Number(data.quantity);
        const current = Number(product.currentBid) / 100;

        if (bidAmount <= current) {
            return toast.error(`Your bid must be greater than current bid (₹${current.toFixed(2)})`);
        }

        setPlacing(true);
        try {
            // Simulate API
            await new Promise((r) => setTimeout(r, 800));

            toast.success("Bid placed successfully!");

            onOpenChange(false);
        }
        catch (error: any) {
            toast.error(error.message || "Failed to place bid");
        }
        finally {
            setPlacing(false);
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
                    <DialogTitle>Place a Bid</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4 mb-2">
                    {/* Left: Product Description */}
                    <div className="space-y-4">
                        <div className="w-full h-44 rounded-md overflow-hidden bg-gray-100">
                            <img
                                src={product?.image}
                                alt={product?.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">{product?.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                by{" "}
                                <span className="font-medium">
                                    {product?.seller?.name}
                                </span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Current bid:{" "}
                                <span className="font-semibold">
                                    {formatAmount(product?.currentBid)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right: Bid Form */}
                    <form
                        id="bid-form"
                        onSubmit={bidForm.handleSubmit(handlePlaceBid)}
                        className="space-y-4"
                    >
                        <FieldGroup>
                            <Controller
                                name="bidAmount"
                                control={bidForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Your bid (GBP)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={(
                                                (product?.currentBid || 0) + 1
                                            ).toFixed(2)}
                                            type="number"
                                            step="5"
                                            min="0"
                                        // autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="quantity"
                                control={bidForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Quantity ({product?.quantityAvailable ?? 1} available)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            type="number"
                                            min={1}
                                            max={product?.quantityAvailable ?? 1}
                                            {...field}
                                        // autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <div>
                            {/* Summary */}
                            <div className="mt-6 bg-gray-50 p-4 rounded">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <div>Your bid</div>
                                    <div>
                                        {bidForm.watch("bidAmount")
                                            ? `${formatAmount(bidForm.watch("bidAmount"))}`
                                            : "—"}
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                    <div>Service fee (5%)</div>
                                    <div>
                                        {bidForm.watch("bidAmount")
                                            ? `${(
                                                formatAmount(bidForm.watch("bidAmount") * 0.05)
                                            )}`
                                            : "—"}
                                    </div>
                                </div>
                                <div className="flex justify-between font-semibold mt-2">
                                    <div>You will pay</div>
                                    <div>
                                        {bidForm.watch("bidAmount")
                                            ? `${formatAmount(total + (bidForm.watch("bidAmount") * 0.5))}`
                                            : "—"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full flex flex-row gap-3 md:col-span-2">
                            <Button type="submit" className="flex-1" disabled={placing}>
                                {placing ? "Placing…" : "Place a bid"}
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BidDialog;