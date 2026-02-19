// src/components/admin/update-product-condition.tsx
"use client";
import React, { startTransition, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox.tsx";
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
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { handleDeleteProductCondition, handleUpdateProductCondition } from "@/lib/actions/product-condition/condition.action.ts";
import { UpdateProductConditionSchema, type UpdateProductConditionSchemaType } from "@/schemas/product-condition/update-condition.schema.ts";
import type { UpdateProductConditionDetailsPropsType } from "@/types/admin-props.type.ts";


const UpdateProductCondition = ({ currentUser, productCondition }: UpdateProductConditionDetailsPropsType) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const productConditionEnumValues = [
        "NEW", "NEW_OTHER", "NEW_WITH_DEFECTS", "CERTIFIED_REFURBISHED", "EXCELLENT_REFURBISHED", "VERY_GOOD_REFURBISHED", "GOOD_REFURBISHED", "SELLER_REFURBISHED", "LIKE_NEW", "PRE_OWNED_EXCELLENT", "USED_EXCELLENT", "PRE_OWNED_FAIR", "USED_VERY_GOOD", "USED_GOOD", "USED_ACCEPTABLE", "FOR_PARTS_OR_NOT_WORKING"
    ];

    const updateProductConditionFrom = useForm<UpdateProductConditionSchemaType>({
        resolver: zodResolver(UpdateProductConditionSchema),
        defaultValues: {
            productConditionName: productCondition.productConditionName || "",
            description: productCondition.description,
            productConditionEnum: productCondition.productConditionEnum || "NEW",
        }
    });

    useEffect(() => {
        updateProductConditionFrom.reset({
            productConditionName: productCondition.productConditionName || "",
            description: productCondition.description,
            productConditionEnum: productCondition.productConditionEnum || "NEW",
        });

    }, [productCondition, updateProductConditionFrom]);

    const onSubmit = async (data: UpdateProductConditionSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleUpdateProductCondition(productCondition._id, data);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            router.refresh();
        }
        catch (error: Error | any) {
            console.error("Error updating product condition by admin: ", error);
            toast.error("Error updating product condition by admin", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProductConditionById = async (conditionId: string) => {
        try {
            const response = await handleDeleteProductCondition(conditionId);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
            }

            toast.success("Successful", {
                description: response.message,
            });
            startTransition(() => router.replace("/admin/product-conditions/manage/list"));
        }
        catch (error: Error | any) {
            console.error("Error deleting product-condition: ", error);
            toast.error("Error deleting product-condition", {
                description: error.message
            });
        }
    };

    const handleClear = () => {
        updateProductConditionFrom.reset({
            productConditionName: "",
            description: null,
            productConditionEnum: "NEW"
        });
    };

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                    Update Product Condition
                </h1>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
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
            </div>

            <div className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl xl:max-w-xl">
                    <form
                        id="create-productCondition-form"
                        onSubmit={updateProductConditionFrom.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="productConditionName"
                                control={updateProductConditionFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="description"
                                control={updateProductConditionFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Description
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id={field.name}
                                            value={field.value || undefined}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Type your description here"
                                            className="bg-white text-[#1A202C] dark:text-gray-100 placeholder:text-[#A0AEC0] min-h-50 max-h-75"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="productConditionEnum"
                                control={updateProductConditionFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Status
                                        </FieldLabel>
                                        <Combobox
                                            items={productConditionEnumValues || []}
                                            value={field.value}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <ComboboxInput placeholder="Select a category" />
                                            <ComboboxContent>
                                                <ComboboxEmpty>No items found.</ComboboxEmpty>
                                                <ComboboxList>
                                                    {(item) => (
                                                        <ComboboxItem
                                                            key={item}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <div className="flex items-center justify-evenly gap-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        Please wait...
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Submit
                                    </>
                                )}
                            </Button>
                            {/* <Button
                                type="button"
                                variant={"outline"}
                                className="flex-1 text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                                onClick={handleClear}
                            >
                                Clear
                            </Button> */}
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

        </section>
    );
};

export default UpdateProductCondition;