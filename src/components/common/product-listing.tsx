// src/components/common/product-listing.tsx
"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import ProductCard from "@/components/buyer/product-card.tsx";
import BidDialog from "@/components/buyer/bid-dialog.tsx";
import type { ProductListingPropsType, ProductPropsType } from "@/types/common-props.type.ts";


const ProductListing = ({ currentUser, products, categories, sellers, productConditions }: ProductListingPropsType) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductPropsType | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const pageSize = 8;
    const [page, setPage] = useState(1);
    const total = products?.length ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    const openBidDialog = (productData: ProductPropsType) => {
        setSelectedProduct(productData);
        setDialogOpen(true);
    };

    // const paged = useMemo(() => {
    //     const start = (page - 1) * pageSize;
    //     return products?.slice(start, start + pageSize);
    // }, [page, products]);

    return (
        <section className="container mx-auto px-4 py-8">
            <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Live Auctions</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Trending items open for bidding — highest bid wins.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary">Filter</Button>
                    <Button>New Auction</Button>
                </div>
            </header>

            {(products && (products.length > 0)) &&
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const seller = sellers?.find((seller) => seller._id === product.sellerId);
                        const category = categories?.find((category) => category._id === product.categoryId);
                        const condition = productConditions?.find((condition) => condition._id === product.conditionId);

                        return seller && category && condition ?
                            <ProductCard
                                key={product._id}
                                product={product}
                                category={category}
                                seller={seller}
                                productCondition={condition}
                                currentUser={currentUser}
                                onBid={() => openBidDialog({ currentUser, product, seller, category, condition })}
                            />
                            : null;
                    })}
                </div>
            }

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
                    open={dialogOpen}
                    onOpenChange={(o) => setDialogOpen(o)}
                    currentUser={selectedProduct.currentUser}
                    product={selectedProduct.product}
                    seller={selectedProduct.seller}
                />
            )}
        </section>
    );
};

export default ProductListing;