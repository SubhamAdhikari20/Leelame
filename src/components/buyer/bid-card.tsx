// src/components/buyer/bid-card.tsx
"use client";
import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock, Crown } from "lucide-react";
import type { BidCardPropsType } from "@/types/common-props.type.ts";


const BidCard = ({ currentUser, bid, buyer, isHighest }: BidCardPropsType) => {
    const timeAgo = formatDistanceToNow(new Date(bid.createdAt ?? new Date()), { addSuffix: true });
    // const formatAmount = (amount: number) =>
    //     new Intl.NumberFormat("en-IN", {
    //         style: "currency",
    //         currency: "NPR",
    //         maximumFractionDigits: 0,
    //     }).format(amount);

    const formatAmount = (amount: number) => {
        const format = Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });
        return `Rs. ${format}`;
    };
    return (
        <Card className="group overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-5">
                {/* Avatar */}
                <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-emerald-200 dark:ring-emerald-900 transition-all group-hover:ring-emerald-400">
                    {buyer.profilePictureUrl ? (
                        <Image
                            fill
                            src={buyer.profilePictureUrl}
                            alt={buyer.fullName || "Buyer"}
                        />

                    ) : (
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-lg">
                            {(buyer?.fullName || "NaN")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                            {buyer.fullName}
                        </p>
                        {isHighest && (
                            <Badge
                                variant="default"
                                className="bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md px-3 py-1 text-xs font-bold flex items-center gap-1"
                            >
                                <Crown className="h-3.5 w-3.5" />
                                HIGHEST BID
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono text-xs">{timeAgo}</span>
                    </div>
                </div>

                {/* Bid Amount */}
                <div className="text-right">
                    <p className="text-3xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
                        {formatAmount(bid.bidAmount)}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-500/70 dark:text-emerald-400/70 mt-0.5">
                        NPR
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default BidCard;