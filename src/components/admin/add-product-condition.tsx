// src/components/admin/add-product-condition.tsx
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
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CreateProductConditionSchema, type CreateProductConditionSchemaType } from "@/schemas/product-condition/create-condition.schema.ts";
import { handleCreateProductCondition } from "@/lib/actions/product-condition/condition.action.ts";
import type { CurrentUserPropsType } from "@/types/current-user.type.ts";


const AddProductCondition = ({ currentUser }: CurrentUserPropsType) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const productConditionEnumValues = [
        "NEW", "NEW_OTHER", "NEW_WITH_DEFECTS", "CERTIFIED_REFURBISHED", "EXCELLENT_REFURBISHED", "VERY_GOOD_REFURBISHED", "GOOD_REFURBISHED", "SELLER_REFURBISHED", "LIKE_NEW", "PRE_OWNED_EXCELLENT", "USED_EXCELLENT", "PRE_OWNED_FAIR", "USED_VERY_GOOD", "USED_GOOD", "USED_ACCEPTABLE", "FOR_PARTS_OR_NOT_WORKING"
    ];

    const createProductConditionFrom = useForm<CreateProductConditionSchemaType>({
        resolver: zodResolver(CreateProductConditionSchema),
        defaultValues: {
            productConditionName: "",
            productConditionEnum: "NEW"
        }
    });

    const onSubmit = async (data: CreateProductConditionSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleCreateProductCondition(data);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            startTransition(() => router.replace("/admin/product-conditions/manage/list"));
        }
        catch (error: Error | any) {
            console.error("Error creating product condition by admin: ", error);
            toast.error("Error creating product condition by admin", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="p-4 md:p-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                Add Product Condition
            </h1>

            <div className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl xl:max-w-xl">
                    <form
                        id="create-productCondition-form"
                        onSubmit={createProductConditionFrom.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="productConditionName"
                                control={createProductConditionFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Condition Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Condition Name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="description"
                                control={createProductConditionFrom.control}
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
                                control={createProductConditionFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Condition Enum
                                        </FieldLabel>
                                        <Combobox
                                            items={productConditionEnumValues || []}
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
                        </div>
                    </form>
                </div>
            </div>

        </section >
    );
};

export default AddProductCondition;