// src/components/admin/list-products.tsx
"use client";
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import Image from "next/image";
import { Button } from "@/components/ui/button.tsx";
import { format } from "date-fns";
import { Plus, MoreVerticalIcon, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ListProductsPropsType } from "@/types/admin-props.type.ts";


const ListProducts = ({ currentUser, products, categories, productConditions }: ListProductsPropsType) => {
    const router = useRouter();

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Manage Products</h1>
                <Button variant="outline" className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white" onClick={() => router.push("/seller/products/add")}>
                    <Plus className="mr-1 h-4 w-4" />
                    New Product
                </Button>
            </div>
            {!products || products.length === 0 ? (
                <div className="rounded-md border p-8 text-center shadow-md">
                    <p className="text-lg font-medium mb-4">No products found</p>
                    <p className="text-sm text-muted-foreground mb-6">
                        There are no products in the system yet. Create one to get started.
                    </p>
                    <Button
                        className="bg-green-600 hover:bg-green-500 text-white"
                        onClick={() => router.push("/seller/products/add")}
                    >
                        New Product
                    </Button>
                </div>
            ) : (
                // <ScrollArea className="w-full whitespace-nowrap">
                <div className="overflow-x-auto rounded-md border shadow-sm">
                    <Table>
                        <TableHeader className="bg-green-600 hover:bg-green-500">
                            <TableRow>
                                <TableHead className="text-white font-semibold text-[16px]"></TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Name</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Category</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Commission (%)</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Start Price (NPR)</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">End Date</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Status</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Sold Out</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <div className="relative w-10 h-10 shrink-0 overflow-hidden border border-gray-600 dark:border-gray-100 rounded-sm">
                                            {product.productImageUrls && product.productImageUrls.length > 0 ? (
                                                <Image
                                                    fill
                                                    src={product.productImageUrls[0]}
                                                    alt={product.productName || "Product"}
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
                                    </TableCell>
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell>
                                        {categories?.find(category => category._id === product.categoryId)?.categoryName}
                                    </TableCell>
                                    <TableCell>{product.commission}</TableCell>
                                    <TableCell>{product.startPrice}</TableCell>
                                    <TableCell>{format(product.endDate, "PPp")}</TableCell>
                                    <TableCell>{product.isVerified ? "Verified" : "Unverified"}</TableCell>
                                    <TableCell>{product.soldToBuyerId ? "Sold Out" : "Available"}</TableCell>
                                    <TableCell className="text-center flex gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreVerticalIcon />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => router.push(`/admin/products/view-details/${product._id}`)}>
                                                    <FileText />
                                                    View Details
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </section>
    );
};

export default ListProducts;