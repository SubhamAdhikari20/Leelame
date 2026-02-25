// src/components/buyer/product-card.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./../ui/card.tsx";
import { Button } from "../ui/button.tsx";
import { Avatar, AvatarFallback } from "./../ui/avatar.tsx";
import { Badge } from "./../ui/badge.tsx";
import Link from "next/link";
import Image from "next/image";
import { Gavel, Heart } from "lucide-react";
import { toast } from "sonner";
import type { ProductCardPropsType } from "@/types/common-props.type.ts";


const ProductCard = ({ currentUser, product, category, seller, productCondition, onBid, onToggleFavourite }: ProductCardPropsType) => {
    // Local favourite state (can connect to backend later)
    const [isFavourite, setIsFavourite] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const endDate = new Date(product.endDate).getTime();
            const now = new Date().getTime();
            const difference = endDate - now;

            if (difference <= 0) {
                setTimeLeft("Auction Ended");
                return "Ended";
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            // const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // const hours = Math.floor(difference / (1000 * 60 * 60));
            // const minutes = Math.floor((difference / (1000 * 60)) % 60);

            const pad = (num: number) => String(num).padStart(2, "0");
            setTimeLeft(`${days}d ${pad(hours)}h ${pad(minutes)}m left`);
            // setTimeLeft(`${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s left`);
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [product.endDate]);


    const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newStatus = !isFavourite;
        setIsFavourite(newStatus);

        onToggleFavourite?.(product!, newStatus);

        toast.success(
            newStatus ? "Added to favourites 💖" : "Removed from favourites 💔"
        );
    };

    const formatAmount = (amount: any) => {
        const format = Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });
        return `Rs. ${format}`;
    };

    return (
        <Card className="py-0 gap-4 w-full max-w-md mx-auto overflow-hidden shadow hover:shadow-lg dark:shadow-[0_2px_3px_1px_rgba(255,255,255,0.1),0_2px_2px_-1px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_10px_15px_2px_rgba(255,255,255,0.1),0_2px_8px_3px_rgba(255,255,255,0.1)] transition-shadow duration-200">
            <Link href={`/products/${product._id}`} className="contents">
                <div className="relative h-55 w-full overflow-hidden border-b dark:border-gray-700">
                    {product && product.productImageUrls && product.productImageUrls.length > 0 ? (
                        <Image
                            src={product.productImageUrls[0]}
                            alt={product.productName || "Product"}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-200"
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
                    {/* Favourite button */}
                    <button
                        onClick={handleFavourite}
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm cursor-pointer"
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${isFavourite ? "fill-red-500 text-red-500" : "text-gray-600"
                                }`}
                        />
                    </button>
                </div>

                <CardHeader className="px-4">
                    <CardTitle className="text-base font-semibold line-clamp-2">{product.productName}</CardTitle>
                    <CardDescription className="flex gap-2 mt-1">
                        <Badge variant="secondary">{category.categoryName}</Badge>
                        <Badge variant="outline">{productCondition.productConditionName}</Badge>
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-4 pb-4 border-b">
                    {/* <p className="text-sm text-muted-foreground mb-1">{location}</p> */}
                    <p className="text-lg font-bold">{formatAmount(product.currentBidPrice)}</p>
                    <p className="text-xs text-muted-foreground">
                        10 bids •
                        <span
                            className={`${timeLeft === "Auction Ended"
                                ? "text-red-600 dark:text-red-500"
                                : "text-gray-600 dark:text-gray-200"
                                }`}
                        >
                            {` ${timeLeft}`}
                        </span>
                    </p>
                </CardContent>
            </Link>

            {/* <Separator /> */}

            <CardFooter className="px-4 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        {seller.profilePictureUrl ? (
                            <Image
                                fill
                                src={seller.profilePictureUrl}
                                alt={seller.fullName || "Seller"}
                            />

                        ) : (
                            <AvatarFallback>
                                {(seller?.fullName || "NaN")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="text-xs font-medium">{seller.fullName}</span>
                </div>
                <Button
                    type="button"
                    size="sm"
                    onClick={onBid}
                >
                    <Gavel className="mr-1 h-4 w-4" />
                    Bid Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;