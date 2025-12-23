// src/app/(app)/products/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import ProductCard from "@/components/buyer/product-card.tsx";
import BidDialog from "@/components/buyer/bid-dialog.tsx";


const ProductPage = () => {
    const mockProducts = [
        {
            id: "bike-001",
            title: "Vintage Royal Enfield — Classic Look",
            image:
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
            category: "Motorbike",
            condition: "Used",
            startPrice: 3000,
            currentBid: 4500,
            bids: 12,
            auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
            seller: { name: "A. Singh", avatar: "https://i.pravatar.cc/80?img=12", rating: 4.6 },
        },
        {
            id: "guitar-002",
            title: "Fender Stratocaster — American Standard",
            image:
                "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=def",
            category: "Musical",
            condition: "Like new",
            startPrice: 2500,
            currentBid: 3750,
            bids: 8,
            auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 3 + 1000 * 60 * 40).toISOString(),
            seller: { name: "Beth R.", avatar: "https://i.pravatar.cc/80?img=44", rating: 4.9 },
        },
        {
            id: "camera-003",
            title: "Sony A7 III Mirrorless Camera Body Only",
            image:
                "https://plus.unsplash.com/premium_photo-1723651234920-f45e156d487c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U29ueSUyMEE3JTIwSUlJJTIwTWlycm9ybGVzcyUyMENhbWVyYSUyMEJvZHklMjBPbmx5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
            category: "Electronics",
            condition: "Refurbished",
            startPrice: 8000,
            currentBid: 9200,
            bids: 23,
            auctionEnd: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
            seller: { name: "CameraShop", avatar: "https://i.pravatar.cc/80?img=35", rating: 4.7 },
        },
        {
            id: "watch-004",
            title: "Rolex (Replica) — Decorative Display",
            image:
                "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9sZXh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
            category: "Accessories",
            condition: "New",
            startPrice: 1200,
            currentBid: 1950,
            bids: 5,
            auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
            seller: { name: "LuxuryStore", avatar: "https://i.pravatar.cc/80?img=22", rating: 4.8 },
        },
    ];

    const pageSize = 8;
    const [page, setPage] = useState(1);
    const products = mockProducts;
    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return products.slice(start, start + pageSize);
    }, [page, products]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const openBidDialog = (product: any) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handlePlaceBid = ({ productId, bidAmount, quantity }: { productId: string; bidAmount: number; quantity: number }) => {
        // hook this to your API: place bid -> update product.currentBid and bids count
        // For now we update the mock in-memory product set (not persisted)
        const index = products.findIndex((p) => p.id === productId);
        if (index >= 0) {
            products[index].currentBid = Math.round(Number(bidAmount) * 100);
            products[index].bids = (products[index].bids || 0) + 1;
        }
    };

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} onBid={() => openBidDialog(p)} />
                ))}
            </div>


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
            <BidDialog
                open={dialogOpen}
                onOpenChange={(o) => setDialogOpen(o)}
                product={selectedProduct}
                onPlaceBid={handlePlaceBid}
            />
        </section>
    );
};

export default ProductPage;