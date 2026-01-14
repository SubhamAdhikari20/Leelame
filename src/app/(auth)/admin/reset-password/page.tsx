// src/app/(auth)/admin/reset-password/[email]/page.tsx
"use client";
import React, { startTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { AdminResetPasswordSchema, AdminResetPasswordSchemaType } from "@/schemas/auth/admin/reset-password.schema.ts";
import { handleAdminResetPassword } from "@/lib/actions/auth/admin-auth.action.ts";


const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const resetPasswordForm = useForm<AdminResetPasswordSchemaType>({
        resolver: zodResolver(AdminResetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: AdminResetPasswordSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleAdminResetPassword(email ?? "", data);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Success", {
                description: response.message,
            });
            startTransition(() => router.replace(`/admin/login`));
        }
        catch (error: Error | any) {
            console.error("Error in reseting password of the user", error);
            toast("Reset Password failed", {
                description: error.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    return (
        <section className="flex justify-center items-center px-5 py-20 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border rounded-lg shadow-md">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
                    Reset Password
                </h1>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                    Enter your new password to reset your password.
                </p>

                <form
                    id="reset-password-form"
                    onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="newPassword"
                            control={resetPasswordForm.control}
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
                                            onClick={togglePasswordVisibility}
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
                            control={resetPasswordForm.control}
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
                                            onClick={toggleConfirmPasswordVisibility}
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

                    <div className="flex items-center justify-center">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                "Reset"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ResetPassword;