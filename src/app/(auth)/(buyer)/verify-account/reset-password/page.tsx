// src/app/(auth)/(buyer)/verify-account/reset-password/[email]/page.tsx
"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp.tsx";
import { Button } from "@/components/ui/button.tsx";
import axios, { AxiosError } from "axios";
import { verifyAccountResetPasswordSchema } from "@/schemas/auth/buyer/verify-account-reset-password.schema.ts";
import { BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";


const VerifyAccountResetPassword = () => {
    const [isVerifying, setIsVerifying] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const verifyAccountResetPasswordForm = useForm<z.infer<typeof verifyAccountResetPasswordSchema>>({
        resolver: zodResolver(verifyAccountResetPasswordSchema),
        defaultValues: {
            otp: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof verifyAccountResetPasswordSchema>) => {
        setIsVerifying(true);
        try {
            const response = await axios.put<BuyerResponseDtoType>("/api/users/buyer/verify-account/reset-password", {
                email: email,
                otp: data.otp,
            });

            if (!response.data.success) {
                toast.error("Failed", {
                    description: response.data.message,
                });
            }

            toast.success("Success", {
                description: response.data.message,
            });
            router.replace(`/reset-password?email=${email}`);
        }
        catch (error) {
            const axiosError = error as AxiosError<BuyerResponseDtoType>;
            console.error("Error in verifying OTP for reseting password: ", axiosError);
            toast.error("Failed to verify OTP", {
                description: axiosError.response?.data.message,
            });
        }
        finally {
            setIsVerifying(false);
        }
    };

    return (
        <section className="flex justify-center items-center px-5 py-20 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border rounded-lg shadow-md">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
                    Enter Verification Code
                </h1>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Please check your email for a 6-digit code for reset password.
                </p>
                <form
                    id="verify-account-reset-password-form"
                    onSubmit={verifyAccountResetPasswordForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="otp"
                            control={verifyAccountResetPasswordForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Verification Code
                                    </FieldLabel>
                                    <div className="flex justify-center mb-6">
                                        <InputOTP
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            maxLength={6}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <InputOTPGroup>
                                                {[...Array(6)].map(
                                                    (_, i) => (
                                                        <InputOTPSlot
                                                            key={i}
                                                            index={i}
                                                        />
                                                    )
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
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
                            disabled={isVerifying}
                            className="w-full font-semibold"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default VerifyAccountResetPassword;