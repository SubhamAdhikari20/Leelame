// src/components/seller/product-view-details.tsx
"use client";
import React, { startTransition, useRef, useState } from "react";
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
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar1Icon, Edit, IndianRupeeIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { handleDeleteProduct } from "@/lib/actions/product/product.action.ts";
import type { ProductViewDetailsPropsType } from "@/types/seller-props.type.ts";


const ProductViewDetails = ({ currentUser, product, categories, productConditions }: ProductViewDetailsPropsType) => {
    const router = useRouter();

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const handleDeleteProductById = async (productId: string) => {
        try {
            const response = await handleDeleteProduct(productId);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
            }

            toast.success("Successful", {
                description: response.message,
            });
            startTransition(() => router.replace("/seller/products/manage/list"));
        }
        catch (error: Error | any) {
            console.error("Error deleting product: ", error);
            toast.error("Error deleting product", {
                description: error.message
            });
        }
    };

    const formatAmount = (amount: number) => {
        const format = Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });
        return `Rs. ${format}`;
    };

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                    Product Details
                </h1>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white"
                        onClick={() => router.push(`/seller/products/manage/update/${product?._id}`)}
                    >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product <strong> "{product?.productName}"</strong> and remove its data from the system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                                    onClick={() => handleDeleteProductById(product!._id)}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* <div className="grid gap-6 lg:grid-cols-2 grid-cols-1"> */}
                {/* <div className="relative w-full h-64 md:h-[400px] rounded-lg overflow-hidden border dark:border-white"> */}

                <div className="flex items-center lg:w-3/5 relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-10 dark:bg-gray-900">
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

                <Card className="lg:w-2/5 p-4 shadow-lg gap-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg md:text-xl">{product?.productName}</CardTitle>
                        {currentUser?._id === product?.sellerId &&
                            <CardDescription className="flex items-center justify-between text-muted-foreground text-[12px]">
                                <span>
                                    Listed by: {currentUser?.fullName}
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

                        {/* <div className="flex items-center justify-between">
                            <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                Start Price
                            </span>
                            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-200">
                                <IndianRupeeIcon className="h-4 w-4" />
                                <span className="font-bold text-sm md:text-[16px]">{product?.startPrice}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                Current Bid Price
                            </span>
                            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-200">
                                <IndianRupeeIcon className="h-4 w-4" />
                                <span className="font-bold text-sm md:text-[16px]">{product?.currentBidPrice}</span>
                            </div>
                        </div> */}

                        <div className="flex items-center justify-between pb-2 border-b dark:border-gray-800">
                            <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                Bid Interval Price
                            </span>
                            <span className="font-bold text-sm md:text-[16px] text-gray-600 dark:text-gray-200">
                                {formatAmount(product.bidIntervalPrice)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b dark:border-gray-800">
                            <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                Commission
                            </span>
                            <span className="text-sm md:text-[16px] text-gray-600 dark:text-gray-200">
                                {product.commission} %
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-2">
                            <span className="text-[13px] md:text-[15px] text-gray-500 dark:text-gray-400">
                                End Date
                            </span>
                            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-200">
                                <Calendar1Icon className="h-4 w-4" />
                                <span className="text-[11px] md:text-[13px]">{format(product.endDate, "PPp")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="mt-5">
                        <Button
                            size="sm"
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-full h-10 text-base"
                        >
                            ← Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Overview / Reviews Tabs */}
            <Tabs defaultValue="overview" className="space-y-4  mt-8">
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
                        {product?.description}
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
        </section>
    );
};

export default ProductViewDetails;