// src/app/(auth)/(buyer)/verify-account/registration/page.tsx
"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldDescription,
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
import { verifyAccountRegistrationSchema } from "@/schemas/auth/buyer/verify-account-registration.schema.ts";
import { BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";

const VerifyAccountRegistration = () => {
    const [isVerifying, setIsVerifying] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get("username");

    const verifyAccountRegistrationForm = useForm<z.infer<typeof verifyAccountRegistrationSchema>>({
        resolver: zodResolver(verifyAccountRegistrationSchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof verifyAccountRegistrationSchema>) => {
        setIsVerifying(true);
        try {
            const response = await axios.put<BuyerResponseDtoType>("/api/users/buyer/verify-account/registration", {
                username: username,
                otp: data.code
            });

            if (response.data.success) {
                toast.success("Success", {
                    description: response.data.message,
                });
                router.replace("/login");
            }
        }
        catch (error) {
            const axiosError = error as AxiosError<BuyerResponseDtoType>;
            console.error("Error verifying OTP for user registration: ", axiosError);
            toast.error("Error verifying OTP for user registration", {
                description: axiosError.response?.data.message,
            });
        }
        finally {
            setIsVerifying(false);
        }
    };
    return (
        <section className="flex justify-center items-center px-5 py-20 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 border rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-100">
                        Verify Your Account
                    </h1>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Enter the verification code sent to your email for account registration
                    </p>
                </div>
                <div>
                    <form
                        id="verify-account-registration-form"
                        onSubmit={verifyAccountRegistrationForm.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Controller
                                name="code"
                                control={verifyAccountRegistrationForm.control}
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
                                className="w-full font-semibold"
                                disabled={isVerifying}
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
            </div>
        </section>
    );
};

export default VerifyAccountRegistration;