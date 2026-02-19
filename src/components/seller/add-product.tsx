// src/components/seller/add-product.tsx
"use client";
import React, { startTransition, useRef, useState } from "react";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { CreateProductSchema, type CreateProductSchemaType } from "@/schemas/product/create-product.schema.ts";
import { handleCreateProduct } from "@/lib/actions/product/product.action.ts";
import type { AddProductPropsType } from "@/types/seller-props.type.ts";


const AddProduct = ({ currentUser, categories, productConditions }: AddProductPropsType) => {
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [productImagePreviews, setProductImagePreviews] = useState<string[] | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    // const [date, setDate] = React.useState<Date | undefined>(undefined);

    const createProductFrom = useForm<CreateProductSchemaType>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            productName: "",
            startPrice: 0,
            bidIntervalPrice: 0,
            endDate: new Date(),
            categoryId: "",
            conditionId: "",
        }
    });

    const onSubmit = async (data: CreateProductSchemaType) => {
        setIsSubmitting(true);
        try {
            let response;
            if (selectedFiles && selectedFiles.length > 0) {
                const productImageFormData = new FormData();
                productImageFormData.append("folder", "product-images");

                selectedFiles.forEach((file) => {
                    productImageFormData.append("product-images", file, file.name);
                });

                response = await handleCreateProduct(data, productImageFormData);
            }
            else {
                response = await handleCreateProduct(data);
            }

            if (!response.success) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            handleClear();
            startTransition(() => router.replace("/seller/products/manage/list"));
        }
        catch (error: Error | any) {
            console.error("Error creating product by seller: ", error);
            toast.error("Error creating product by seller", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...(prev || []), ...files]);
        setProductImagePreviews(prev => [
            ...(prev || []),
            ...files.map(f => URL.createObjectURL(f))
        ]);
    };

    // Remove one image by index
    const removeProductImage = (index: number) => {
        setSelectedFiles(files => {
            const updated = [...(files || [])];
            updated.splice(index, 1);
            return updated;
        });
        setProductImagePreviews(prev => {
            const updated = [...(prev || [])];
            URL.revokeObjectURL(updated[index]);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleClear = () => {
        createProductFrom.reset();
        setSelectedFiles(null);
        productImagePreviews?.forEach(URL.revokeObjectURL);
        setProductImagePreviews(null);
    };

    const handleDateSelect = (selected: Date | undefined) => {
        if (!selected) {
            return;
        }

        const current = createProductFrom.getValues("endDate");
        const currentEndDate = current instanceof Date ? current : new Date(current);
        const hours = currentEndDate.getHours();
        const minutes = currentEndDate.getMinutes();

        selected.setHours(hours, minutes, 0, 0);
        createProductFrom.setValue("endDate", selected, { shouldValidate: true });
        setCalendarOpen(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value; // "HH:mm"
        if (!timeStr) return;

        const [hours, minutes] = timeStr.split(":").map(Number) as [number, number];

        const current = createProductFrom.getValues("endDate");
        const currentDate = current instanceof Date ? current : new Date(current);

        const newDate = new Date(currentDate);
        newDate.setHours(hours, minutes, 0, 0);

        createProductFrom.setValue("endDate", newDate, { shouldValidate: true });
    };

    const watchedEndDateRaw = createProductFrom.watch("endDate");
    const watchedEndDate = watchedEndDateRaw instanceof Date
        ? watchedEndDateRaw
        : new Date(watchedEndDateRaw);

    return (
        <section className="p-4 md:p-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Add Product</h1>

            <div className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl xl:max-w-xl">
                    <form
                        id="create-category-form"
                        onSubmit={createProductFrom.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="productName"
                                control={createProductFrom.control}
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
                                control={createProductFrom.control}
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
                                name="categoryId"
                                control={createProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Category
                                        </FieldLabel>
                                        <Combobox
                                            items={categories || []}
                                            value={categories?.find(category => category._id === field.value)?.categoryName || ""}
                                            onValueChange={(value) => {
                                                const selected = categories?.find(category => category.categoryName === value);
                                                field.onChange(selected?._id || "");
                                            }}
                                        >
                                            <ComboboxInput placeholder="Select a category" />
                                            <ComboboxContent>
                                                <ComboboxEmpty>No items found.</ComboboxEmpty>
                                                <ComboboxList>
                                                    {(item) => (
                                                        <ComboboxItem
                                                            key={item._id.toString()}
                                                            value={item.categoryName}
                                                        >
                                                            {item.categoryName}
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

                            <Controller
                                name="conditionId"
                                control={createProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Condition
                                        </FieldLabel>
                                        <Combobox
                                            items={productConditions || []}
                                            // value={productConditions?.find(condition => condition._id === field.value)?.productConditionName || ""}
                                            onValueChange={(value) => {
                                                const selected = productConditions?.find(condition => condition.productConditionName === value);
                                                field.onChange(selected?._id || "");
                                            }}
                                        >
                                            <ComboboxInput placeholder="Select a condition" />
                                            <ComboboxContent>
                                                <ComboboxEmpty>No items found.</ComboboxEmpty>
                                                <ComboboxList>
                                                    {(item) => (
                                                        <ComboboxItem
                                                            key={item._id.toString()}
                                                            value={item.productConditionName}
                                                        >
                                                            {item.productConditionName}
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

                            <Controller
                                name="startPrice"
                                control={createProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Starting Price (NPR)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Starting Price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="bidIntervalPrice"
                                control={createProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Bid Interval Price (NPR)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Bid Interval Price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="endDate"
                                control={createProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex gap-4">
                                            <div className="w-full space-y-3">
                                                <FieldLabel htmlFor={field.name}>
                                                    End Date
                                                </FieldLabel>
                                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {watchedEndDate ? format(watchedEndDate, "PPP") : "Select date"}
                                                            <ChevronDownIcon data-icon="inline-end" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            captionLayout="dropdown"
                                                            selected={watchedEndDate}
                                                            onSelect={handleDateSelect}
                                                            disabled={(date) => date < new Date()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="w-full space-y-3">
                                                <FieldLabel htmlFor="time-picker-optional">End Time</FieldLabel>
                                                <Input
                                                    type="time"
                                                    step="60"
                                                    value={watchedEndDate ? format(watchedEndDate, "HH:mm") : "00:00"}
                                                    onChange={handleTimeChange}
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    size="sm"
                                    className="bg-gray-400 hover:bg-gray-300 flex-1"
                                    disabled={isSubmitting}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Choose Product Images
                                </Button>

                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={onImagesChange}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />

                                {(productImagePreviews && selectedFiles && (selectedFiles.length > 0)) && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            setSelectedFiles(null);
                                            setProductImagePreviews(null);
                                        }}
                                        className="flex-1 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>

                            {(productImagePreviews && (productImagePreviews.length > 0)) && (
                                <div className="mt-2 w-full max-w-full flex flex-row whitespace-nowrap space-x-2 overflow-x-auto overflow-y-hidden py-2">
                                    {productImagePreviews.map((src, index) => (
                                        <div key={index} className="relative w-25 h-25 shrink-0 overflow-hidden sm:w-32 sm:h-32 md:w-40 md:h-40 mr-4">
                                            <Image
                                                src={src}
                                                fill
                                                className="object-cover rounded"
                                                alt={`Preview ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeProductImage(index)}
                                                className="cursor-pointer outline absolute top-1 right-1 bg-white dark:bg-background rounded-full shadow w-7 h-7"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                        Create Product
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant={"outline"}
                                className="flex-1 text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                                onClick={handleClear}
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddProduct;