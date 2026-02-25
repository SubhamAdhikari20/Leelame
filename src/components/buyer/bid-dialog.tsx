// src/components/buyer/bid-dialog.tsx
"use client";
import React, { startTransition, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { handleCreateBid } from "@/lib/actions/bid/bid.action.ts";
import { CreateBidSchema, type CreateBidSchemaType } from "@/schemas/bid/create-bid.schema.ts";
import type { BidDialogBoxPublicPropsType } from "@/types/common-props.type.ts";
import { Minus, Plus } from "lucide-react";


const BidDialog = ({ currentUser, product, seller, open, onOpenChange }: BidDialogBoxPublicPropsType) => {
    const router = useRouter();
    const [bidPlacing, setBidPlacing] = useState(false);
    const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
    const [pendingData, setPendingData] = useState<CreateBidSchemaType | null>(null);

    const placeBidForm = useForm<CreateBidSchemaType>({
        resolver: zodResolver(CreateBidSchema),
        defaultValues: {
            productId: product._id || "",
            buyerId: currentUser?._id || "",
            bidAmount: Number(product.currentBidPrice + product.bidIntervalPrice)
        }
    });

    useEffect(() => {
        if (open && product) {
            placeBidForm.reset({
                productId: product._id,
                buyerId: currentUser?._id || "",
                bidAmount: Number(product.currentBidPrice + product.bidIntervalPrice),
            });
        }
    }, [open, product, currentUser, placeBidForm]);

    const minRequiredBidAmount = Number(product.currentBidPrice || 0) + Number(product.bidIntervalPrice || 0);
    const currentBidAmount = Number(placeBidForm.watch("bidAmount")) || 0;
    const commissionRate = Number(product.commission) || 0;
    const serviceFee = currentBidAmount * (commissionRate / 100);
    const totalPayableAmount = currentBidAmount + serviceFee;
    const isMinusButtonDisabled = currentBidAmount <= minRequiredBidAmount || bidPlacing;

    const onPressPlusButton = () => {
        const bidAmount = currentBidAmount;
        const bidIntervalPrice = Number(product.bidIntervalPrice) || 0;
        const totalValue = bidAmount + bidIntervalPrice;

        placeBidForm.setValue("bidAmount", totalValue, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }

    const onPressMinusButton = () => {
        const bidAmount = currentBidAmount;
        const bidIntervalPrice = Number(product.bidIntervalPrice) || 0;
        const newValue = Math.max(minRequiredBidAmount, bidAmount - bidIntervalPrice);

        placeBidForm.setValue("bidAmount", newValue, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }

    const handleBidFormSubmit = (data: CreateBidSchemaType) => {
        setPendingData(data);
        setShowConfirmDialogBox(true);
    };

    const handlePlaceBid = async () => {
        setShowConfirmDialogBox(false);

        if (!pendingData || !product) {
            toast.error("Data Error!", {
                description: "The pending bid and product data is not available."
            });
            return;
        }

        // const bidAmount = Number(pendingData.bidAmount);

        // if (bidAmount < minRequiredBidAmount) {
        //     return toast.error("Bid Failed", {
        //         description: `Your bid must be greater than or equal to the sum of current bid and bid interval price (Rs.${minRequiredBidAmount.toFixed(2)})`,
        //     });
        // }

        // const endDate = new Date(product.endDate).getTime();
        // const now = new Date().getTime();
        // const difference = endDate - now;

        // if (difference <= 0) {
        //     return toast.error("Bid Failed", {
        //         description: "Auction has already ended for this product!"
        //     });
        // }

        setBidPlacing(true);

        try {
            if (!currentUser) {
                toast.error("Authentication Error!", {
                    description: "Please, login to place a bid."
                });

                setPendingData(null);
                setShowConfirmDialogBox(false);
                setBidPlacing(false);
                onOpenChange(false);
                startTransition(() => router.push("/login"));
                return;
            }

            const response = await handleCreateBid(pendingData);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });

            router.refresh();
            onOpenChange(false);
        }
        catch (error: Error | any) {
            console.error("Error bidPlacing bid: ", error);
            toast.error("Error bidPlacing bid", {
                description: error.message
            });
        }
        finally {
            setBidPlacing(false);
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
                                    {(product?.productName || "NaN")
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
                            <p className="text-sm text-muted-foreground mt-2">
                                Current bid:{" "}
                                <span className="font-semibold">
                                    {formatAmount(product.currentBidPrice)}
                                </span>
                            </p>

                            <p className="text-sm text-muted-foreground mt-2">
                                Bid Interval Price:{" "}
                                <span className="font-semibold">
                                    {formatAmount(product.bidIntervalPrice)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <form
                        id="bid-form"
                        onSubmit={placeBidForm.handleSubmit(handleBidFormSubmit)}
                    >
                        <div className="flex flex-col gap-5 justify-between w-full h-full">
                            <div className="space-y-6">
                                <FieldGroup>
                                    <Controller
                                        name="bidAmount"
                                        control={placeBidForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Your bid (NPR)
                                                </FieldLabel>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={onPressMinusButton}
                                                        disabled={isMinusButtonDisabled}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>

                                                    <Input
                                                        {...field}
                                                        id={field.name}
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder={(
                                                            ((product.currentBidPrice + product.bidIntervalPrice) || 0)
                                                        ).toFixed(2)}
                                                        type="number"
                                                        inputMode="decimal"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const sanitizedValue = value
                                                                .replace(/[^0-9.]/g, "")
                                                                .replace(/(\..*?)\..*/g, "$1");

                                                            if (sanitizedValue === "" || /^\d*\.?\d*$/.test(sanitizedValue)) {
                                                                field.onChange(sanitizedValue === "" ? undefined : parseFloat(sanitizedValue));
                                                            }
                                                        }}
                                                        autoComplete="off"
                                                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={onPressPlusButton}
                                                        disabled={bidPlacing}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div>Your bid</div>
                                        <div>
                                            {currentBidAmount ? formatAmount(currentBidAmount) : "—"}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                        <div>Service fee ({commissionRate}%)</div>
                                        <div>
                                            {currentBidAmount ? formatAmount(serviceFee) : "—"}
                                        </div>
                                    </div>
                                    <div className="flex justify-between font-semibold mt-2">
                                        <div>You will pay</div>
                                        <div>
                                            {currentBidAmount ? formatAmount(totalPayableAmount) : "—"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1 text-muted-foreground text-xs">
                                    <span className="font-bold">
                                        Note:
                                    </span>
                                    <span>
                                        The bid amount must be at least the sum of current bid and bid interval price.
                                    </span>
                                </div>
                            </div>

                            <div className="w-full flex flex-row gap-3 md:col-span-2">
                                <AlertDialog open={showConfirmDialogBox} onOpenChange={setShowConfirmDialogBox}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="submit"
                                            disabled={bidPlacing}
                                            className="flex-1 text-white bg-green-600! hover:bg-green-500! dark:bg-green-600 dark:hover:bg-green-500"
                                        >
                                            {bidPlacing ? "Placing…" : "Place a bid"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You are about to place a bid of <strong className="text-foreground">{formatAmount(pendingData?.bidAmount || 0)}</strong>.
                                                Including commission, your total amount will be <strong className="text-primary">{formatAmount(totalPayableAmount)}</strong>.
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                type="submit"
                                                className="text-white bg-green-600! hover:bg-green-500! dark:bg-green-600 dark:hover:bg-green-500"
                                                onClick={handlePlaceBid}
                                            >
                                                {bidPlacing ? "Placing bid..." : "Yes, Place Bid"}
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

export default BidDialog;