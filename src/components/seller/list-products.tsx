// src/components/product/list-products.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ListProductsPropsType } from "@/types/seller-props.type.ts";


const ListProducts = ({ currentUser, products }: ListProductsPropsType) => {
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
                    <p className="text-sm text-muted-foreground mb-6">There are no products in the system yet. Create one to get started.</p>
                    <Button
                        className="bg-green-600 hover:bg-green-500 text-white"
                        onClick={() => router.push("/seller/products/add")}
                    >New Product</Button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-md border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-600 hover:bg-green-500">
                                <TableHead className="text-white font-semibold text-[16px]">Id</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Profile</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Name</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Email</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Contact</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
            )}
        </section>
    );
};

export default ListProducts;