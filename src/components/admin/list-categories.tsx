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
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleDeleteCategory } from "@/lib/actions/category/category.action.ts";
import type { ListCategoriesPropsType } from "@/types/admin-props.type.ts";


const ListCategories = ({ currentUser, categories }: ListCategoriesPropsType) => {
    const router = useRouter();

    // Handle category delete
    const handleDeleteCategoryById = async (categoryId: string) => {
        try {
            const response = await handleDeleteCategory(categoryId);
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
            console.error("Error deleting category: ", error);
            toast.error("Error deleting category", {
                description: error.message
            });
        }
    };

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Manage Categories</h1>

                <Button variant="outline" className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white" onClick={() => router.push("/admin/categories/add")}>
                    <Plus className="mr-1 h-4 w-4" />
                    New Category
                </Button>
            </div>

            {!categories || categories.length === 0 ? (
                <div className="rounded-md border p-8 text-center shadow-md">
                    <p className="text-lg font-medium mb-4">No categories found</p>
                    <p className="text-sm text-muted-foreground mb-6">There are no categories in the system yet. Create one to get started.</p>
                    <Button
                        className="bg-green-600 hover:bg-green-500 text-white"
                        onClick={() => router.push("/seller/products/add")}
                    >New Category</Button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-md border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-600 hover:bg-green-500">
                                <TableHead className="text-white font-semibold text-[16px]">Name</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Description</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Status</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell >{category.categoryName}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>{category.categoryStatus}</TableCell>
                                    <TableCell className="text-center flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white"
                                            onClick={() => router.push(`/admin/categories/manage/update/${category._id}`)}
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
                                                        This action cannot be undone. This will permanently delete the category
                                                        <strong> "{category.categoryName}"</strong> and remove its data from the system.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        variant="destructive"
                                                        className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                                                        onClick={() => handleDeleteCategoryById(category._id)}
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

export default ListCategories;