// src/components/common/product-view-details-public.tsx
"use client";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card.tsx";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
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
import { Input } from "../ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar1Icon, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { handleCreateBid } from "@/lib/actions/bid/bid.action.ts";
import { CreateBidSchema, type CreateBidSchemaType } from "@/schemas/bid/create-bid.schema.ts";
import type { ProductViewDetailsPublicPropsType } from "@/types/common-props.type.ts";


const ProductViewDetailsPublic = ({ currentUser, product, seller, categories, productConditions }: ProductViewDetailsPublicPropsType) => {
    const router = useRouter();
    const [bidPlacing, setBidPlacing] = useState(false);
    const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
    const [pendingData, setPendingData] = useState<CreateBidSchemaType | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const placeBidForm = useForm<CreateBidSchemaType>({
        resolver: zodResolver(CreateBidSchema),
        defaultValues: {
            productId: product._id || "",
            buyerId: currentUser?._id || "",
            bidAmount: Number(product.currentBidPrice + product.bidIntervalPrice)
        }
    });

    useEffect(() => {
        if (product) {
            placeBidForm.reset({
                productId: product._id,
                buyerId: currentUser?._id || "",
                bidAmount: Number(product.currentBidPrice + product.bidIntervalPrice),
            });
        }
    }, [product, currentUser, placeBidForm]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const endDate = new Date(product.endDate).getTime();
            const now = new Date().getTime();
            const difference = endDate - now;

            if (difference <= 0) {
                setTimeLeft("Auction Ended");
                return;
            }

            // Calculations for days, hours, minutes and seconds
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Format as 00d 00h 00m 00s
            const pad = (num: number) => String(num).padStart(2, "0");
            setTimeLeft(`${pad(days)}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
            // setTimeLeft(`${String(days).padStart(2, "0")}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
            // setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [product.endDate]);

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
        }
        catch (error: Error | any) {
            console.error("Error bid placing bid: ", error);
            toast.error("Error bid placing bid", {
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
        <section className="p-4 md:p-6 mx-auto">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                Product Details
            </h1>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex flex-col gap-5 lg:gap-8 lg:w-4/5">
                    <div className="flex w-full items-center relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-10 dark:bg-gray-900">
                        {/* <div className="flex items-center lg:w-4/5 relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-10 dark:bg-gray-900"> */}
                        <Carousel
                            plugins={[plugin.current]}
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                            opts={{ loop: true }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {(product && product.productImageUrls && (product.productImageUrls.length > 0)) ? (
                                    product.productImageUrls.map((productImageUrl, index) => (
                                        <CarouselItem key={index}>
                                            <div className="relative w-full aspect-16/10 md:aspect-video">
                                                <Image
                                                    src={productImageUrl}
                                                    alt={`${product.productName} - Image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-mono">
                                                    {index + 1} / {product.productImageUrls.length}
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <CarouselItem>
                                        <div className="relative aspect-16/10 md:aspect-video w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                                            <div className="text-center">
                                                <div className="text-6xl mb-4 text-gray-300 dark:text-gray-700">📷</div>
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                                    No images available
                                                </p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900 shadow-lg" />
                            <CarouselNext className="right-4 bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900 shadow-lg" />
                        </Carousel>
                    </div>

                    {/* <div className="lg:w-3/5"> */}
                    <Card className="w-full py-6 shadow-lg gap-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg md:text-xl">{product.productName}</CardTitle>
                            {product.sellerId &&
                                <CardDescription className="flex items-center justify-between text-muted-foreground text-[12px]">
                                    <span>
                                        Listed by: {seller.fullName}
                                    </span>
                                    {productConditions &&
                                        <span>
                                            Condition: {productConditions.find(condition => condition._id === product.conditionId)?.productConditionName}
                                        </span>
                                    }
                                </CardDescription>
                            }

                            {/* <div title={`${Number(bike?.avgRating).toFixed(1)} / 5`} className="text-center flex flex-col gap-2 sm:flex-row items-center space-x-1">
                                <div className="cursor-pointer">
                                    <StarRatings
                                        rating={Number(bike?.avgRating)}
                                        starRatedColor="#FBBF24"
                                        numberOfStars={5}
                                        starDimension="25px"
                                        starSpacing="2px"
                                        starEmptyColor="#E5E7EB"
                                        starHoverColor="#FBBF24"
                                        name="bike-rating"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {Number(bike?.avgRating).toFixed(1)} ({bike.reviewCount ?? 0})
                                </p>
                            </div> */}
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {categories &&
                                <div className="flex items-center justify-between pb-2 border-b dark:border-gray-800">
                                    <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                        Category
                                    </span>
                                    <span className="text-sm md:text-[16px] text-gray-600 dark:text-gray-200">
                                        {categories.find(category => category._id === product.categoryId)?.categoryName}
                                    </span>
                                </div>
                            }

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[12px] md:text-[14px] text-gray-500 dark:text-gray-400 text-xs mb-1">
                                        Start Price
                                    </p>
                                    <p className="text-lg md:text-[20px] xl:text-2xl font-semibold text-emerald-600 dark:text-emerald-500">
                                        {formatAmount(product.startPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-right text-[12px] md:text-[14px] text-gray-500 dark:text-gray-400 text-xs mb-1">
                                        Current Bid Price
                                    </p>
                                    <p className="text-lg md:text-[20px] xl:text-2xl font-semibold text-orange-600 dark:text-orange-500">
                                        {formatAmount(product.currentBidPrice)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b dark:border-gray-800">
                                <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                    Bid Interval Price
                                </span>
                                <span className="font-bold text-sm md:text-[16px] text-gray-600 dark:text-gray-200">
                                    {formatAmount(product.bidIntervalPrice)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-2">
                                <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                    End Date
                                </span>
                                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-200">
                                    <Calendar1Icon className="h-4 w-4" />
                                    <span className="text-[11px] md:text-[13px]">
                                        {format(product.endDate, "PPp")}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* </div> */}

                    {/* Overview / Reviews Tabs */}
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList className="flex gap-2">
                            <TabsTrigger value="overview">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="bids">
                                Bids
                            </TabsTrigger>
                            <TabsTrigger value="reviews">
                                {/* Reviews ({reviews.length}) */}
                                Reviews
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <p className="max-w-none text-sm text-gray-700 dark:text-gray-300">
                                {product.description}
                            </p>
                        </TabsContent>

                        <TabsContent value="bids">
                            <p className="text-center text-gray-500">No bids yet.</p>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <p className="text-center text-gray-500">No reviews yet.</p>
                            {/* {reviews.length === 0 ? (
                        <p className="text-center text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((r) => (
                                <Card key={r.id} className="p-5 flex gap-4 items-start">
                                    <CardHeader className="w-full flex flex-col gap-2 p-0">
                                        <div className="flex gap-2 items-center">
                                            <Avatar className="h-10 w-10 cursor-pointer border border-gray-900">
                                                {(r.customer.profilePictureUrl) ? (
                                                    <Image
                                                        fill
                                                        src={r.customer.profilePictureUrl}
                                                        alt={r.customer.fullName}
                                                    />
                                                ) : (
                                                    <AvatarFallback>
                                                        {((r.customer.fullName ?? r.customer.username ?? "U")
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase())}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <CardTitle className="font-semibold">{r.customer.fullName}</CardTitle>
                                        </div>

                                        <div title={`${Number(r.rating).toFixed(1)} / 5`} className="text-center flex flex-col gap-2 sm:flex-row items-center space-x-1">
                                            <div className="cursor-pointer">
                                                <StarRatings
                                                    rating={Number(r.rating)}
                                                    starRatedColor="#FBBF24"
                                                    numberOfStars={5}
                                                    starDimension="23px"
                                                    starSpacing="2px"
                                                    starEmptyColor="#E5E7EB"
                                                    starHoverColor="#FBBF24"
                                                    name={`review-${r.id}`}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {Number(r.rating).toFixed(1)}
                                            </p>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="w-full flex-1 p-0">
                                        <div className="flex overflow-x-auto space-x-4 py-2">
                                            {r.reviewBikeImageUrl && (
                                                <Dialog open={openImage === r.reviewBikeImageUrl} onOpenChange={val => setOpenImage(val ? r.reviewBikeImageUrl : null)}>
                                                    <DialogTrigger asChild>
                                                        <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg overflow-hidden cursor-pointer">
                                                            <Image src={r.reviewBikeImageUrl!} width={160} height={160} className="object-cover w-full h-full" alt="damage" />
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent className="p-5 lg:max-w-fit! max-h-200 overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Preview</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="w-full">
                                                            <Image src={r.reviewBikeImageUrl!} width={600} height={400} className="object-contain rounded" alt="damage-large" />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>

                                        <CardDescription className="mt-2 text-gray-800">{r.comment}</CardDescription>
                                    </CardContent>

                                    <CardFooter className="p-0 w-full flex items-center">
                                        <p className="mt-1 text-xs text-gray-500">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )} */}
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:w-2/5">
                    <Card className="w-full py-6 shadow-lg gap-2 sticky lg:top-40 inset-x-0">
                        <CardContent className="space-y-3">
                            <div className="flex flex-col items-center">
                                <p className="text-right text-[12px] md:text-[14px] text-gray-500 dark:text-gray-400">
                                    Current Bid Price
                                </p>
                                <p className="text-lg md:text-[20px] xl:text-2xl font-semibold">
                                    {formatAmount(product.currentBidPrice)}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pb-1 border-b dark:border-gray-800">
                                <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                    Bid Interval Price
                                </span>
                                <span className="font-bold text-sm md:text-[16px] text-gray-600 dark:text-gray-200">
                                    {formatAmount(product.bidIntervalPrice)}
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                    Auctions ends in
                                </p>
                                <p
                                    className={`text-lg md:text-[20px] xl:text-2xl font-semibold ${timeLeft === "Auction Ended"
                                        ? "text-red-600 dark:text-red-500"
                                        : "text-gray-600 dark:text-gray-200"
                                        }`}
                                >
                                    {timeLeft}
                                </p>
                            </div>

                            <form
                                id="bid-form"
                                onSubmit={placeBidForm.handleSubmit(handleBidFormSubmit)}
                                className="w-full"
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

                                    <div className="w-full flex flex-row items-center justify-between gap-4">
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
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => router.back()}
                                        >
                                            ← Back
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default ProductViewDetailsPublic;