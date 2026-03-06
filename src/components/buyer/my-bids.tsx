// src/components/buyer/my-bids.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import MyBidsCard from "./my-bids-card.tsx";
import ProductCard from "@/components/buyer/product-card.tsx";
import BidDialog from "@/components/buyer/bid-dialog.tsx";
import BuyNowDialog from "@/components/buyer/buy-now-dialog.tsx";
import type { ProductPropsType } from "@/types/common-props.type.ts";
import type { MyBidsPagePropsType } from "@/types/buyer-prop.type.ts";


const MyBids = ({ currentUser, bids, products, categories, sellers, productConditions }: MyBidsPagePropsType) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductPropsType | null>(null);
    const [bidDialogOpen, setBidDialogOpen] = useState(false);
    const [buyNowDialogOpen, setBuyNowDialogOpen] = useState(false);

    const pageSize = 8;
    const [page, setPage] = useState(1);
    const total = products?.length ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    const openBidDialog = (productData: ProductPropsType) => {
        setSelectedProduct(productData);
        setBidDialogOpen(true);
    };

    const openBuyNowDialog = (productData: ProductPropsType) => {
        setSelectedProduct(productData);
        setBuyNowDialogOpen(true);
    };

    return (
        <section className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-4">My Bids</h1>

            <Tabs defaultValue="live-bids" className="space-y-4">
                <TabsList className="flex gap-2">
                    <TabsTrigger value="live-bids">
                        Live Bids
                    </TabsTrigger>
                    <TabsTrigger value="won-bids">
                        Won Bids
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="live-bids">
                    {bids.length === 0 ? (
                        <p>You have no active bids.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {bids.map((bid) => {
                                const product = products.find((product) => product._id === bid.productId);
                                const seller = sellers?.find((seller) => seller._id === product?.sellerId);
                                const category = categories?.find((category) => category._id === product?.categoryId);
                                const condition = productConditions?.find((condition) => condition._id === product?.conditionId);

                                return product && seller && category && condition ? (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        category={category}
                                        seller={seller}
                                        productCondition={condition}
                                        currentUser={currentUser}
                                        onBid={() => openBidDialog({ currentUser, product, seller, category, condition })}
                                        onBuyNow={() => openBuyNowDialog({ currentUser, product, seller, category, condition })}
                                    />
                                ) : null;
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="won-bids">
                    {/* {rentalsHistory.length === 0 ? (
                        <p>You have no active rentals.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {rentalsHistory.map(rental => (
                                <BookedBikeCard key={rental.id} booking={rental} />
                            ))}
                        </div>
                    )} */}
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Button key={i} variant={page === i + 1 ? "default" : "ghost"} onClick={() => setPage(i + 1)}>{i + 1}</Button>
                    ))}
                    <Button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
                </div>
            )}

            {/* Bid Dialog */}
            {selectedProduct && (
                <BidDialog
                    open={bidDialogOpen}
                    onOpenChange={(o) => setBidDialogOpen(o)}
                    currentUser={selectedProduct.currentUser}
                    product={selectedProduct.product}
                    seller={selectedProduct.seller}
                />
            )}

            {/* Buy Now Dialog */}
            {selectedProduct && (
                <BuyNowDialog
                    open={buyNowDialogOpen}
                    onOpenChange={(o) => setBuyNowDialogOpen(o)}
                    currentUser={selectedProduct.currentUser}
                    product={selectedProduct.product}
                    seller={selectedProduct.seller}
                />
            )}

        </section>
    );
};

export default MyBids;