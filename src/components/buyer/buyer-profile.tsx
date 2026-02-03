// src/components/buyer/buyer-profile.tsx
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
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
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { UpdateProfileDetailsSchema, type UpdateProfileDetailsSchemaType } from "@/schemas/buyer/update-profile-details.schema.ts";
import type { CurrentUserType, CurrentUserPropsType } from "@/types/current-user.type.ts";
import type { BuyerApiResponseType } from "@/types/api-response.type.ts";
import { handleGetCurrentBuyerUser, handleUploadBuyerProfilePicture } from "@/lib/actions/buyer/profile-details.action.ts";


const BuyerProfile = ({ currentUser }: CurrentUserPropsType) => {
    const router = useRouter();

    const [preview, setPreview] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const debounced = useDebounceCallback(setUsername, 300);

    const getCurrentUser = useCallback(async () => {
        try {
            const result = await handleGetCurrentBuyerUser(currentUser!._id);
            if (!result.success) {
                toast.error("Error fetching user data", {
                    description: result.message ?? "Unknown"
                });
                return;
            }
            currentUser = result.data as CurrentUserType;
            // console.log("User data:", res.data.user);
        }
        catch (error: Error | any) {
            console.error("Failed to fetch user:", error.message);
        }
    }, []);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    const userDetailsForm = useForm<UpdateProfileDetailsSchemaType>({
        resolver: zodResolver(UpdateProfileDetailsSchema),
        defaultValues: {
            fullName: currentUser?.fullName || "",
            username: currentUser?.username || "",
            email: currentUser?.email || "",
            contact: currentUser?.contact || "",
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get<BuyerApiResponseType>(`/api/users/buyer/check-username-unique?username=${username}`);
                    if (response.data.success) {
                        setUsernameMessage(response.data.message);
                    }
                }
                catch (error) {
                    const axiosError = error as AxiosError<BuyerApiResponseType>;
                    setUsernameMessage(
                        axiosError.response?.data?.message || "Error checking username uniqueness!"
                    );
                }
                finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username]);

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            // const url = URL.createObjectURL(file);
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const onSubmit = async (data: UpdateProfileDetailsSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await axios.put<BuyerApiResponseType>("", data);
            if (response.data.success) {
                toast.success("Success", {
                    description: response.data.message
                });
                // await getCurrentUser();

                if (response.data.user?.username !== currentUser!.username) {
                    router.replace(`/verify-account/registration/${response.data.user?.username}`);
                }
            }
        }
        catch (error: Error | any) {
            console.error("Error updating user details: ", error);
            toast.error("Error updating user details", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        userDetailsForm.reset({
            fullName: "",
            username: "",
            email: "",
            contact: "",
        });
    };

    // Handle delete
    const handleDelete = async (userId: string) => {
        try {
            const response = await axios.delete<BuyerApiResponseType>("",);
            if (response.data.success) {
                toast.success("Successful", {
                    description: response.data.message,
                });
            }
            toast.error("Failed", {
                description: response.data.message,
            });
        }
        catch (error) {
            const axiosError = error as AxiosError<BuyerApiResponseType>;
            console.error("Error deleting user account: ", axiosError);
            toast.error("Error deleting user account: ", {
                description: axiosError.response?.data?.message
            });
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
            formData.append("profilePicture", selectedFile);

            const response = await handleUploadBuyerProfilePicture(currentUser!._id, formData);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Successful", {
                description: response.message,
            });
            setPreview("");
            setSelectedFile(null);
            await getCurrentUser();
        }
        catch (error) {
            const axiosError = error as AxiosError<BuyerApiResponseType>;
            console.error("Image upload failed", axiosError);
            toast.error(`Image upload failed: ${axiosError.response?.data?.message}`);
        }
        finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <div className="w-full xl:max-w-7xl bg-[#d3ecdc] dark:bg-gray-900 border rounded-xl shadow-lg p-5">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">My Profile</h1>
            <div className="flex flex-col xl:flex-row xl:justify-evenly gap-4 justify-center">
                <div className="flex flex-col justify-center items-center gap-4 xl:min-w-[310px]">
                    <Avatar className="h-30 w-30 lg:h-45 lg:w-45 border-2 border-gray-900 dark:border-gray-100">
                        <AvatarImage
                            src={preview ? preview : (currentUser?.profilePictureUrl || undefined)}
                            alt={currentUser?.fullName || currentUser?.username || "Owner"}
                        />
                        <AvatarFallback className="text-6xl font-semibold text-gray-700 dark:text-gray-100">
                            {(currentUser?.fullName || currentUser?.username || "O")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-row! items-center gap-2">
                            <Button
                                type="button"
                                className="bg-gray-400 dark:bg-gray-300 hover:bg-gray-500 dark:hover:bg-gray-200"
                                disabled={isUploadingImage}
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
                                disabled={isUploadingImage}
                            />

                            {(preview && selectedFile) && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    disabled={isUploadingImage}
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreview(currentUser?.profilePictureUrl || "");
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

                    <div className="mt-auto xl:w-full xl:flex xl:items-center xl:justify-center">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" className="hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user account
                                        <strong> "{currentUser?.fullName}"</strong> and remove their data from the system.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 dark:text-gray-100" onClick={() => handleDelete(currentUser!._id)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="w-full flex-1 max-w-2xl xl:max-w-xl space-y-8 bg-white dark:bg-gray-800 border dark:border-gray-600 p-8 rounded-lg shadow-lg">
                    <form
                        id="update-user-details-form"
                        onSubmit={userDetailsForm.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Controller
                                name="fullName"
                                control={userDetailsForm.control}
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
                                name="username"
                                control={userDetailsForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Username"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            autoComplete="off"
                                        />
                                        {isCheckingUsername && (
                                            <Loader2 className="animate-spin" />
                                        )}
                                        {username && (
                                            <p
                                                className={`text-sm ${usernameMessage ===
                                                    "Username is available"
                                                    ? "text-green-500 dark:text-green-400"
                                                    : "text-red-500 dark:text-red-400"
                                                    }`}
                                            >
                                                {usernameMessage}
                                            </p>
                                        )}
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={userDetailsForm.control}
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
                                control={userDetailsForm.control}
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
                                        Update Details
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
        </div>
    );
};

export default BuyerProfile;