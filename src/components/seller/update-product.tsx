// src/components/seller/update-product.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { ChevronDownIcon, FileText, Loader2, X } from "lucide-react";
import Image from "next/image";
import { UpdateProductSchema, type UpdateProductSchemaType } from "@/schemas/product/update-product.schema.ts";
import { handleUpdateProduct } from "@/lib/actions/product/product.action.ts";
import type { UpdateProductPropsType } from "@/types/seller-props.type.ts";


const UpdateProduct = ({ currentUser, product, categories, productConditions }: UpdateProductPropsType) => {
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [productImagePreviews, setProductImagePreviews] = useState<string[] | null>(null);
    const [removedExistingProductImages, setRemovedExistingProductImages] = useState<string[] | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [calendarOpen, setCalendarOpen] = React.useState(false);

    const updateProductFrom = useForm<UpdateProductSchemaType>({
        resolver: zodResolver(UpdateProductSchema),
        defaultValues: {
            productName: product.productName || "",
            description: product.description,
            startPrice: product.startPrice || 0,
            bidIntervalPrice: product?.bidIntervalPrice || 0,
            endDate: product.endDate ? new Date(product.endDate) : new Date(),
            categoryId: product.categoryId || "",
            conditionId: product.conditionId || "",
            removedExisitingProductImageUrls: []
        }
    });

    useEffect(() => {
        updateProductFrom.reset({
            productName: product.productName || "",
            description: product.description,
            startPrice: product.startPrice || 0,
            bidIntervalPrice: product.bidIntervalPrice || 0,
            endDate: product.endDate ? new Date(product.endDate) : new Date(),
            categoryId: product.categoryId || "",
            conditionId: product.conditionId || "",
            removedExisitingProductImageUrls: []
        });
    }, [product, updateProductFrom]);

    const onSubmit = async (data: UpdateProductSchemaType) => {
        setIsSubmitting(true);
        try {
            let response;
            const productImageFormData = new FormData();
            const updateProductPlayLoad = {
                ...data
            }

            if (selectedFiles && (selectedFiles.length > 0)) {
                productImageFormData.append("folder", "product-images");

                if (removedExistingProductImages && (removedExistingProductImages.length > 0)) {
                    updateProductPlayLoad.removedExisitingProductImageUrls = removedExistingProductImages;
                }
                // else {
                selectedFiles.forEach((file) => {
                    productImageFormData.append("product-images", file, file.name);
                });
                // }

                response = await handleUpdateProduct(product!._id, updateProductPlayLoad, productImageFormData);
            }
            else {
                if (removedExistingProductImages && (removedExistingProductImages.length > 0)) {
                    productImageFormData.append("folder", "product-images");

                    updateProductPlayLoad.removedExisitingProductImageUrls = removedExistingProductImages;
                    response = await handleUpdateProduct(product!._id, updateProductPlayLoad, productImageFormData);
                }
                else {
                    response = await handleUpdateProduct(product!._id, updateProductPlayLoad);
                }
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
            setSelectedFiles(null);
            productImagePreviews?.forEach(URL.revokeObjectURL);
            setProductImagePreviews(null);
            setRemovedExistingProductImages(null);
            router.refresh();
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

    const removeExistingProductImage = (url: string) => {
        // setRemovedExistingProductImages((prev) => [...(prev || []), url]);

        setRemovedExistingProductImages((prev) => {
            if (!prev) {
                return [url];
            }
            if (prev.includes(url)) {
                return prev.filter(u => u !== url);
            }
            else {
                return [...prev, url];
            }
        });
    };

    const handleDateSelect = (selected: Date | undefined) => {
        if (!selected) {
            return;
        }

        const current = updateProductFrom.getValues("endDate");
        const currentEndDate = current instanceof Date ? current : new Date(current);
        const hours = currentEndDate.getHours();
        const minutes = currentEndDate.getMinutes();

        selected.setHours(hours, minutes, 0, 0);
        updateProductFrom.setValue("endDate", selected, { shouldValidate: true });
        setCalendarOpen(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value; // "HH:mm"
        if (!timeStr) return;

        const [hours, minutes] = timeStr.split(":").map(Number) as [number, number];

        const current = updateProductFrom.getValues("endDate");
        const currentDate = current instanceof Date ? current : new Date(current);

        const newDate = new Date(currentDate);
        newDate.setHours(hours, minutes, 0, 0);

        updateProductFrom.setValue("endDate", newDate, { shouldValidate: true });
    };

    const watchedEndDateRaw = updateProductFrom.watch("endDate");
    const watchedEndDate = watchedEndDateRaw instanceof Date
        ? watchedEndDateRaw
        : new Date(watchedEndDateRaw);

    return (
        <section className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                    Update Product
                </h1>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="hover:bg-green-600 hover:text-white border-green-500 text-green-600 dark:text-white"
                    onClick={() => router.push(`/seller/products/view-details/${product?._id}`)}
                >
                    <FileText className="mr-1 h-4 w-4" />
                    View Details
                </Button>
            </div>

            <div className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl xl:max-w-xl">
                    <form onSubmit={updateProductFrom.handleSubmit(onSubmit)} className="space-y-10">
                        <FieldGroup>
                            {/* Product Name */}
                            <Controller
                                name="productName"
                                control={updateProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                        <Input {...field} id={field.name} placeholder="Name" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Description */}
                            <Controller
                                name="description"
                                control={updateProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            id={field.name}
                                            className="min-h-40 bg-white text-black dark:text-white"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Category Combobox */}
                            <Controller
                                name="categoryId"
                                control={updateProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Category</FieldLabel>
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
                                                        <ComboboxItem key={item._id} value={item.categoryName}>
                                                            {item.categoryName}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Condition Combobox */}
                            <Controller
                                name="conditionId"
                                control={updateProductFrom.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Condition
                                        </FieldLabel>
                                        <Combobox
                                            items={productConditions || []}
                                            value={productConditions?.find(condition => condition._id === field.value)?.productConditionName || ""}
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

                            {/* Prices */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="startPrice"
                                    control={updateProductFrom.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Starting Price (NPR)</FieldLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="bidIntervalPrice"
                                    control={updateProductFrom.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Bid Interval (NPR)</FieldLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </Field>
                                    )}
                                />
                            </div>

                            {/* End Date & Time */}
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-3">
                                    <FieldLabel>End Date</FieldLabel>
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {watchedEndDate ? format(watchedEndDate, "PPP") : "Select date"}
                                                <ChevronDownIcon className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={watchedEndDate}
                                                onSelect={handleDateSelect}
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <FieldLabel>End Time</FieldLabel>
                                    <Input
                                        type="time"
                                        value={watchedEndDate ? format(watchedEndDate, "HH:mm") : "00:00"}
                                        onChange={handleTimeChange}
                                    />
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="space-y-4">
                                <FieldLabel>Product Images</FieldLabel>

                                {/* {(product && product.productImageUrls && (product.productImageUrls.length > 0)) && (
                                    <div className="flex flex-wrap gap-2">
                                        {product.productImageUrls.map((url, i) => (
                                            <div key={i} className="relative w-24 h-24 border rounded overflow-hidden opacity-70">
                                                <Image src={url} alt="Existing" fill className="object-cover" />
                                                <span className="absolute bottom-0 w-full bg-black/50 text-[10px] text-white text-center">Existing</span>
                                            </div>
                                        ))}
                                    </div>
                                )} */}

                                {/* Existing Images */}
                                {(product && product.productImageUrls && (product.productImageUrls.length > 0)) && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Current Images (click × to remove)</p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.productImageUrls.map((productImageUrl, index) => {
                                                const isMarked = removedExistingProductImages?.includes(productImageUrl);
                                                return (
                                                    // <div
                                                    //     key={index}
                                                    //     className={`relative w-30 h-30 border-2 rounded-md overflow-hidden transition-all ${isMarked ? "opacity-40 line-through" : ""
                                                    //         }`}
                                                    // >
                                                    <div
                                                        key={index}
                                                        className={`relative w-25 h-25 border rounded overflow-hidden transition-opacity ${isMarked ? "opacity-40 grayscale" : "opacity-100"}`}
                                                    >
                                                        <Image
                                                            src={productImageUrl}
                                                            alt="Existing"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingProductImage(productImageUrl)}
                                                            className={`absolute top-0 right-0 m-0 p-1 text-white rounded-bl ${isMarked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-[10px] cursor-pointer`}
                                                            aria-label={isMarked ? "Unmark image deletion" : "Mark image for deletion"}
                                                        >
                                                            {isMarked ? "Undo" : <X className="h-4 w-4" />}
                                                        </button>
                                                        <span className="absolute bottom-0 w-full bg-black/50 text-[10px] text-white text-center">Existing</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-6">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-gray-400 hover:bg-gray-300 flex-1"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Add New Images
                                    </Button>

                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={onImagesChange}
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

                                {/* New Previews */}
                                {(productImagePreviews && (productImagePreviews.length > 0)) && (
                                    <div className="flex flex-row space-x-2 overflow-x-auto py-2">
                                        {productImagePreviews.map((src, index) => (
                                            <div key={index} className="relative w-25 h-25 shrink-0 border-2 border-orange-500 rounded overflow-hidden">
                                                <Image
                                                    src={src}
                                                    fill
                                                    className="object-cover"
                                                    alt={`New Preview ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeProductImage(index)}
                                                    className="cursor-pointer absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FieldGroup>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Update Product"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 text-cyan-600 border-cyan-600 hover:bg-cyan-50"
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

export default UpdateProduct;