// src/components/admin/list-product-conditions.tsx
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleDeleteProductCondition } from "@/lib/actions/product-condition/condition.action.ts";
import type { ListProductConditionsPropsType } from "@/types/admin-props.type.ts";


const ListProductConditions = ({ currentUser, productConditions }: ListProductConditionsPropsType) => {
    const router = useRouter();

    // Handle product condition delete
    const handleDeleteProductConditionById = async (productConditionId: string) => {
        try {
            const response = await handleDeleteProductCondition(productConditionId);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
            }

            toast.success("Successful", {
                description: response.message,
            });
            router.refresh();
        }
        catch (error: Error | any) {
            console.error("Error deleting productCondition: ", error);
            toast.error("Error deleting productCondition", {
                description: error.message
            });
        }
    };

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                    Manage Product Conditions
                </h1>

                <Button variant="outline" className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white" onClick={() => router.push("/admin/product-conditions/add")}>
                    <Plus className="mr-1 h-4 w-4" />
                    New Condition
                </Button>
            </div>

            {!productConditions || productConditions.length === 0 ? (
                <div className="rounded-md border p-8 text-center shadow-md">
                    <p className="text-lg font-medium mb-4">No product conditions found</p>
                    <p className="text-sm text-muted-foreground mb-6">
                        There are no product conditions in the system yet. Create one to get started.
                    </p>
                    <Button
                        className="bg-green-600 hover:bg-green-500 text-white"
                        onClick={() => router.push("/admin/product-conditions/add")}
                    >
                        New Condition
                    </Button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-md border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-600 hover:bg-green-500">
                                <TableHead className="text-white font-semibold text-[16px]">Name</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Description</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]">Condition Enum</TableHead>
                                <TableHead className="text-white font-semibold text-[16px]"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {productConditions.map((productCondition) => (
                                <TableRow key={productCondition._id}>
                                    <TableCell >{productCondition.productConditionName}</TableCell>
                                    <TableCell className="max-w-[100px] md:max-w-[220px]">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <p className="truncate">
                                                    {productCondition.description
                                                        ? productCondition.description
                                                        : <span className="text-muted-foreground">—</span>
                                                    }
                                                </p>
                                            </TooltipTrigger>

                                            {productCondition.description &&
                                                <TooltipContent side="top" className="max-w-xs">
                                                    <p>
                                                        {productCondition.description}
                                                    </p>
                                                </TooltipContent>
                                            }
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{productCondition.productConditionEnum}</TableCell>
                                    <TableCell className="text-center flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white"
                                            onClick={() => router.push(`/admin/product-conditions/manage/update/${productCondition._id}`)}
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
                                                        This action cannot be undone. This will permanently delete the product condition <strong> "{productCondition.productConditionName}"</strong> and remove its data from the system.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        variant="destructive"
                                                        className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                                                        onClick={() => handleDeleteProductConditionById(productCondition._id)}
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

export default ListProductConditions;