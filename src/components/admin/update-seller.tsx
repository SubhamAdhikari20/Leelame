// src/components/admin/update-seller.tsx
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
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { toast } from "sonner";
import { Loader2, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UpdateSellerAccountSchema, type UpdateSellerAccountSchemaType } from "@/schemas/admin/manage-seller-account.schema.ts";
import { handleUpdateSellerProfileDetailsByAdmin, handleUploadSellerProfilePictureByAdmin } from "@/lib/actions/admin/manage-seller.action.ts";
import type { UpdateSellerProfileDetailsPropsType } from "@/types/admin-props.type.ts";


const UpdateSeller = ({ currentUser, seller }: UpdateSellerProfileDetailsPropsType) => {
    const router = useRouter();

    const [preview, setPreview] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const updateSellerAccountForm = useForm<UpdateSellerAccountSchemaType>({
        resolver: zodResolver(UpdateSellerAccountSchema),
        defaultValues: {
            fullName: seller.fullName || "",
            email: seller.email || "",
            contact: seller.contact || "",
        }
    });

    useEffect(() => {
        updateSellerAccountForm.reset({
            fullName: seller.fullName || "",
            email: seller.email || "",
            contact: seller.contact || "",
        });

        setPreview("");
        setSelectedFile(null);
    }, [seller, updateSellerAccountForm]);

    const onSubmit = async (data: UpdateSellerAccountSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleUpdateSellerProfileDetailsByAdmin(seller!._id, data);
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
            console.error("Error updating seller account details by admin: ", error);
            toast.error("Error updating seller account details by admin", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleUploadImage = async () => {
        if (!selectedFile) {
            toast.error("Please select an image before uploading.");
            return;
        }

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("profile-picture-seller", selectedFile, selectedFile.name);
            formData.append("folder", "profile-pictures/sellers");

            const response = await handleUploadSellerProfilePictureByAdmin(seller._id, formData);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Successful", {
                description: response.message,
            });
            // setPreview("");
            setSelectedFile(null);
            router.refresh();
        }
        catch (error: Error | any) {
            console.error("Image upload failed: ", error);
            toast.error("Image upload failed", {
                description: error.message
            });
        }
        finally {
            setIsUploadingImage(false);
        }
    };

    const handleClear = () => {
        updateSellerAccountForm.reset({
            fullName: "",
            email: "",
            contact: "",
        });
    };

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    return (
        <section className="w-full xl:max-w-7xl p-5">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Create Seller</h1>
            <div className="flex flex-col xl:flex-row xl:justify-evenly gap-4 justify-center">
                <div className="flex flex-col justify-center items-center gap-4 xl:min-w-[310px]">
                    <Avatar className="h-30 w-30 lg:h-45 lg:w-45 border-2 border-gray-900 dark:border-gray-100">
                        {preview || (seller && seller.profilePictureUrl) ? (
                            <Image
                                fill
                                src={preview ? preview : seller.profilePictureUrl!}
                                alt={seller.fullName || "Admin"}
                            />
                        ) : (
                            <AvatarFallback className="text-6xl font-semibold text-gray-700 dark:text-gray-100">
                                {(seller.fullName || "NaN")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-row! items-center gap-2">
                            <Button
                                type="button"
                                className="bg-gray-400 dark:bg-gray-300 hover:bg-gray-500 dark:hover:bg-gray-200"
                                disabled={isSubmitting}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Profile Picture
                            </Button>

                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="hidden"
                                disabled={isSubmitting}
                            />

                            {(preview && selectedFile) && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreview("");
                                        // setPreview(seller?.profilePictureUrl || "");
                                    }}
                                    className="dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="text-sm text-gray-500 dark:text-gray-200"
                            onClick={handleUploadImage}
                            disabled={!selectedFile || isUploadingImage}
                        >
                            {selectedFile ? (isUploadingImage ? (
                                <>
                                    Please wait...
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Upload Image
                                </>
                            )
                            ) : <>Select Image to Upload</>}
                        </Button>
                    </div>
                </div>

                <div className="w-full flex-1 max-w-2xl xl:max-w-xl space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                    <form
                        id="create-seller-account-by-admin-form"
                        onSubmit={updateSellerAccountForm.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="fullName"
                                control={updateSellerAccountForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Full Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Full Name"
                                        // autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={updateSellerAccountForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Email Address
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Email"
                                        // autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="contact"
                                control={updateSellerAccountForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Contact
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Contact"
                                        // autoComplete="off"
                                        />
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
                                className="flex-1 bg-orange-500 hover:bg-orange-600"
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

export default UpdateSeller;