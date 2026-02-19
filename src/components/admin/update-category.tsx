// src/components/admin/update-category.tsx
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
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { handleDeleteCategory, handleUpdateCategory } from "@/lib/actions/category/category.action.ts";
import { UpdateCategorySchema, type UpdateCategorySchemaType } from "@/schemas/category/update-category.schema.ts";
import type { UpdateCategoryDetailsPropsType } from "@/types/admin-props.type.ts";


const UpdateCategory = ({ currentUser, category }: UpdateCategoryDetailsPropsType) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateCategoryFrom = useForm<UpdateCategorySchemaType>({
        resolver: zodResolver(UpdateCategorySchema),
        defaultValues: {
            categoryName: category.categoryName || "",
            description: category.description,
            categoryStatus: category.categoryStatus || "inactive",
        }
    });

    useEffect(() => {
        updateCategoryFrom.reset({
            categoryName: category.categoryName || "",
            description: category.description,
            categoryStatus: category.categoryStatus || "inactive",
        });
    }, [category, updateCategoryFrom]);

    const onSubmit = async (data: UpdateCategorySchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleUpdateCategory(category._id, data);
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
            console.error("Error updating category by admin: ", error);
            toast.error("Error updating category by admin", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

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
            startTransition(() => router.replace("/admin/product-conditions/manage/list"));
        }
        catch (error: Error | any) {
            console.error("Error deleting category: ", error);
            toast.error("Error deleting category", {
                description: error.message
            });
        }
    };

    const handleClear = () => {
        updateCategoryFrom.reset({
            categoryName: "",
            description: null,
            categoryStatus: "inactive"
        });
    };

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                    Update Category
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
                                This action cannot be undone. This will permanently delete the category <strong> "{category.categoryName}"</strong> and remove its data from the system.
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
            </div>

            <div className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl xl:max-w-xl">
                    <form
                        id="create-category-form"
                        onSubmit={updateCategoryFrom.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="categoryName"
                                control={updateCategoryFrom.control}
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
                                control={updateCategoryFrom.control}
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
                                name="categoryStatus"
                                control={updateCategoryFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Status
                                        </FieldLabel>
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="categoryStatus"
                                                checked={field.value === "active"}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked ? "active" : "inactive");
                                                }}
                                            />

                                            <div className="space-y-1 leading-none">
                                                <FieldLabel htmlFor={field.name}>
                                                    {field.value === "active" ? "Active" : "Inactive"}
                                                </FieldLabel>
                                            </div>
                                        </div>
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

export default UpdateCategory;