// src/components/buyer/product-card.tsx
"use client";
import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card.tsx";
import { Button } from "../ui/button.tsx";
import { Avatar, AvatarFallback } from "./../ui/avatar.tsx";
import { Badge } from "./../ui/badge.tsx";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { ProductCardPropsType } from "@/types/common-props.type.ts";


const ProductCard = ({ product, category, seller, onBid, onToggleFavourite }: ProductCardPropsType) => {
    // Local favourite state (can connect to backend later)
    const [isFavourite, setIsFavourite] = useState(false);

    const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // prevent Link navigation
        const newStatus = !isFavourite;
        setIsFavourite(newStatus);

        // Optional callback if parent handles persistence
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

    const timeRemaining = () => {
        const diff = new Date(product!.endDate).getTime() - new Date().getTime();
        if (diff <= 0) return "Ended";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${hours}h ${minutes}m left`;
    };

    return (
        <Card className="pt-0 gap-4 w-full max-w-md mx-auto overflow-hidden shadow hover:shadow-lg dark:shadow-[0_2px_3px_1px_rgba(255,255,255,0.1),0_2px_2px_-1px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_10px_15px_2px_rgba(255,255,255,0.1),0_2px_8px_3px_rgba(255,255,255,0.1)] transition-shadow duration-200">
            <Link href={`/product/${product?._id}`}>
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
            </Link>

            <CardHeader className="px-4">
                <CardTitle className="text-base font-semibold line-clamp-2">{product?.productName}</CardTitle>
                <CardDescription className="flex gap-2 mt-1">
                    <Badge variant="secondary">{category?.categoryName}</Badge>
                    <Badge variant="outline">Used</Badge>
                </CardDescription>
            </CardHeader>

            <CardContent className="px-4">
                {/* <p className="text-sm text-muted-foreground mb-1">{location}</p> */}
                <p className="text-lg font-bold">{formatAmount(product?.currentBidPrice)}</p>
                <p className="text-xs text-muted-foreground">10 bids • {timeRemaining()}</p>
            </CardContent>

            <CardFooter className="px-4 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        {/* <AvatarImage src={seller?.profilePictureUrl!} alt={seller?.fullName!} />
                        <AvatarFallback>{seller?.fullName?.[0]}</AvatarFallback> */}
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
                    <span className="text-sm font-medium">{seller?.fullName}</span>
                </div>
                <Button size="sm" onClick={onBid}>
                    Bid Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;