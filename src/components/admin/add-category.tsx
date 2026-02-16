// src/components/admin/add-category.tsx
"use client";
import React, { startTransition, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CreateCategorySchema, type CreateCategorySchemaType } from "@/schemas/category/create-category.schema.ts";
import { handleCreateCategory } from "@/lib/actions/category/category.action.ts";
import type { CurrentUserPropsType } from "@/types/current-user.type.ts";


const AddCategory = ({ currentUser }: CurrentUserPropsType) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const createCategoryFrom = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            categoryName: "",
            description: "",
            categoryStatus: "inactive"
        }
    });

    const onSubmit = async (data: CreateCategorySchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleCreateCategory(data);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            startTransition(() => router.replace("/admin/categories/manage/list"));
        }
        catch (error: Error | any) {
            console.error("Error creating category by admin: ", error);
            toast.error("Error creating category by admin", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="p-4 md:p-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Add Category</h1>

            <div className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl xl:max-w-xl">
                    <form
                        id="create-category-form"
                        onSubmit={createCategoryFrom.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="categoryName"
                                control={createCategoryFrom.control}
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
                                control={createCategoryFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Description
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id={field.name}
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
                                control={createCategoryFrom.control}
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
                        </div>
                    </form>
                </div>
            </div>

        </section>
    );
};

export default AddCategory;