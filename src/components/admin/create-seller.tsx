// src/components/admin/create-seller.tsx
"use client";
import React, { useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { toast } from "sonner";
import { Loader2, User2 } from "lucide-react";
import type { CurrentUserPropsType } from "@/types/current-user.type.ts";
import { CreateSellerAccountSchema, type CreateSellerAccountSchemaType } from "@/schemas/admin/manage-seller-account.schema.ts";
import { handleCreateSellerAccountByAdmin } from "@/lib/actions/admin/manage-seller.action.ts";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const CreateSeller = ({ currentUser }: CurrentUserPropsType) => {
    const [preview, setPreview] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const createSellerAccountForm = useForm<CreateSellerAccountSchemaType>({
        resolver: zodResolver(CreateSellerAccountSchema),
        defaultValues: {
            fullName: "Thomas Muller",
            email: "guideu0203@gmail.com",
            contact: "9864922260",
            password: "Thomas@123",
            confirmPassword: "Thomas@123",
            role: "seller"
            // fullName: "",
            // email: "",
            // contact: "",
            // password: "",
            // confirmPassword: "",
            // role: "seller"
        }
    });

    const onSubmit = async (data: CreateSellerAccountSchemaType) => {
        setIsSubmitting(true);
        try {
            let response;
            if (selectedFile) {
                const formData = new FormData();
                formData.append("profile-picture-seller", selectedFile, selectedFile.name);
                formData.append("folder", "profile-pictures/sellers");

                response = await handleCreateSellerAccountByAdmin(data, formData);
            }
            else {
                response = await handleCreateSellerAccountByAdmin(data);
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
            setPreview("");
            setSelectedFile(null);
        }
        catch (error: Error | any) {
            console.error("Error creating seller account by admin: ", error);
            toast.error("Error creating seller account by admin", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        createSellerAccountForm.reset({
            fullName: "",
            email: "",
            contact: "",
            password: "",
            confirmPassword: "",
            role: "seller"
        });
        setPreview("");
        setSelectedFile(null);
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

    const toggleSignUpPasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleSignUpConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


    return (
        <section className="w-full xl:max-w-7xl p-5">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Create Seller</h1>
            <div className="flex flex-col xl:flex-row xl:justify-evenly gap-4 justify-center">
                <div className="flex flex-col justify-center items-center gap-4 xl:min-w-[310px]">
                    <Avatar className="h-30 w-30 lg:h-45 lg:w-45 border-2 border-gray-900 dark:border-gray-100">
                        <AvatarImage
                            src={preview || undefined}
                            alt="New Seller"
                        />
                        <AvatarFallback className="text-6xl font-semibold text-gray-700 dark:text-gray-100" >
                            <User2 className="w-15 h-15" />
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-row! items-center gap-2">
                            <Button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-400 dark:bg-gray-300 dark:hover:bg-gray-200"
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
                        </div>

                        {(preview && selectedFile) && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreview(currentUser?.profilePictureUrl || "");
                                }}
                                className="hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>

                <div className="w-full flex-1 max-w-2xl xl:max-w-xl space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                    <form
                        id="create-seller-account-by-admin-form"
                        onSubmit={createSellerAccountForm.handleSubmit(onSubmit)}
                        className="space-y-10"
                    >
                        <FieldGroup>
                            <Controller
                                name="fullName"
                                control={createSellerAccountForm.control}
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
                                control={createSellerAccountForm.control}
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
                                control={createSellerAccountForm.control}
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

                            <Controller
                                name="password"
                                control={createSellerAccountForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Password"
                                                autoComplete="off"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleSignUpPasswordVisibility}
                                                className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                            >
                                                {showPassword ? (
                                                    <FaEye size={18} />
                                                ) : (
                                                    <FaEyeSlash size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="confirmPassword"
                                control={createSellerAccountForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Confirm Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Confirm Password"
                                                autoComplete="off"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleSignUpConfirmPasswordVisibility}
                                                className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                            >
                                                {showConfirmPassword ? (
                                                    <FaEye size={18} />
                                                ) : (
                                                    <FaEyeSlash size={18} />
                                                )}
                                            </button>
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

export default CreateSeller;