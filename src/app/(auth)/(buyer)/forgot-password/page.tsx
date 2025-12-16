// src/app/(auth)/(buyer)/forgot-password/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import axios, { AxiosError } from "axios";
import { forgotPasswordSchema } from "@/schemas/auth/buyer/forgot-password.schema.ts";
import { BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";


const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.put<BuyerResponseDtoType>("/api/users/buyer/forgot-password", {
                email: data.email,
            });
            toast.success("Success", {
                description: response.data.message,
            });

            router.replace(`/verify-account/reset-password?email=${data.email}`);
        }
        catch (error) {
            const axiosError = error as AxiosError<BuyerResponseDtoType>;
            console.error("Error sending forgot password request", axiosError);
            toast("Failed", {
                description:
                    axiosError.response?.data.message ||
                    "Failed to send reset instructions",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex justify-center items-center px-5 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-lg shadow-md">
                <Button
                    variant="ghost"
                    className="relative top-2 left-2 text-gray-600 dark:text-gray-400 hover:text-blue-950 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => router.push("/login")}
                    aria-label="Back to login"
                >
                    <ArrowLeft size={24} />
                </Button>

                <div className="px-8 pb-8">
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                        Enter your email address to receive password reset
                        instructions.
                    </p>

                    <form
                        id="verify-account-registration-form"
                        onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={forgotPasswordForm.control}
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
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500"
                                        // autoComplete="off"
                                        />
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
                                        Sending...
                                    </>
                                ) : (
                                    "Send Code"
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p>
                            Back to login?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 dark:text-blue-500 hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;