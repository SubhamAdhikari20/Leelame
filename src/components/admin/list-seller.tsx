// src/components/admin/list-seller.tsx
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
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ListSellerPropsType } from "@/types/admin-props.type.ts";
import { handleDeleteSellerAccountByAdmin } from "@/lib/actions/admin/manage-seller.action.ts";


const ListSeller = ({ currentUser, sellers }: ListSellerPropsType) => {
    const router = useRouter();

    // Handle delete˝
    const handleDeleteSellerAccount = async (sellerId: string) => {
        try {
            const response = await handleDeleteSellerAccountByAdmin(sellerId);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
            }

            toast.success("Successful", {
                description: response.message,
            });
        }
        catch (error: Error | any) {
            console.error("Error deleting user account: ", error);
            toast.error("Error deleting user account", {
                description: error.message
            });
        }
    };

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Manage Sellers</h1>
                <Button variant="outline" className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white" onClick={() => router.push("/admin/settings/manage-seller/create")}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Seller
                </Button>
            </div>
            {!sellers || sellers.length === 0 ? (
                <div className="rounded-md border p-8 text-center shadow-md">
                    <p className="text-lg font-medium mb-4">No sellers found</p>
                    <p className="text-sm text-muted-foreground mb-6">There are no sellers in the system yet. Create one to get started.</p>
                    <Button onClick={() => router.push("/admin/settings/manage-seller/create")}>Create Seller</Button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-md border shadow-sm">
                    <Table>
                        <TableHeader >
                            <TableRow className="bg-green-600 hover:bg-green-500">
                                <TableHead className="text-white font-semibold text-[16px]">Id</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Profile</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Name</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Email</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Contact</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        
                        <TableBody>
                            {sellers.map((seller) => (
                                <TableRow key={seller._id}>
                                    <TableCell>{seller._id}</TableCell>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 border border-gray-600 dark:border-gray-100">
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
                                    </TableCell>
                                    <TableCell>{seller.fullName}</TableCell>
                                    <TableCell>{seller.email}</TableCell>
                                    <TableCell>{seller.contact}</TableCell>
                                    <TableCell className="text-center flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white"
                                            onClick={() => router.push(`/admin/settings/manage-seller/update/${seller._id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
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
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the seller
                                                        <strong> "{seller.fullName}"</strong> and remove their data from the system.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        variant="destructive"
                                                        className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                                                        onClick={() => handleDeleteSellerAccount(seller._id)}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

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

export default ListSeller;