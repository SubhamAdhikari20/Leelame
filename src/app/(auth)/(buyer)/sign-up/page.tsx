// src/app/(auth)/(buyer)/sign-up/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/api-response";
import { buyerSignUpSchema } from "@/schemas/auth/sign-up-schema.ts";


const SignUp = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();
    const debounced = useDebounceCallback(setUsername, 300);

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(`/api/users/buyer/check-username-unique?username=${username}`);
                    if (response.data.success) {
                        setUsernameMessage(response.data.message);
                    }
                }
                catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username uniqueness!"
                    );

                    // toast.error("Error checking username uniqueness.", {
                    //     description: error.response?.data.message
                    // });
                }
                finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    // zod implementation using react hook form
    const signUpForm = useForm<z.infer<typeof buyerSignUpSchema>>({
        resolver: zodResolver(buyerSignUpSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            contact: "",
            password: "",
            confirmPassword: "",
            terms: false,
            role: "buyer",
        },
    });

    const onSubmit = async (data: z.infer<typeof buyerSignUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/users/buyer/sign-up", data);
            if (response.data.success) {
                toast.success("Sign Up Successful", {
                    description: response.data.message,
                });
                router.replace(`/verify-account/registration?username=${username}`);
            }
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.error("Error in sign up of user: ", axiosError);
            toast.error("Error signing up the user", {
                description: axiosError.response?.data.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // const response = await loginUserWithGoogle(tokenResponse.access_token);
                const response = await axios.post<ApiResponse>("/api/auth/google-login", { tokenResponse });
                if (response.data.success) {
                    toast.success("Google Login Successful", {
                        description: response.data.message,
                    });
                    router.replace("/");
                }
            }
            catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                console.error("Error in google login: ", axiosError);
                toast.error("Error in google login", {
                    description: axiosError.response?.data.message
                });
            }
        },
        onError: () => {
            toast.error("Google login failed");
        },
    });

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    return (
        <section className="min-h-screen flex justify-center items-center px-5 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-lg shadow-lg">
                <Button
                    variant="ghost"
                    className="relative top-2 left-2 text-gray-600 dark:text-gray-400 hover:text-blue-950 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => router.push("/")}
                    aria-label="Back to home"
                >
                    <ArrowLeft size={24} />
                </Button>

                <div className="space-y-8 px-8 pb-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                            Leelame
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Sign up to start your bidding adventure
                        </p>
                    </div>
                    <div>
                        <form
                            id="sign-up-form"
                            onSubmit={signUpForm.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <Controller
                                    name="fullName"
                                    control={signUpForm.control}
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
                                    control={signUpForm.control}
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
                                    name="contact"
                                    control={signUpForm.control}
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
                                    name="email"
                                    control={signUpForm.control}
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
                                    name="password"
                                    control={signUpForm.control}
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
                                    control={signUpForm.control}
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

                                <Controller
                                    name="terms"
                                    control={signUpForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    id="terms"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <div className="space-y-1 leading-none">
                                                    <FieldLabel htmlFor={field.name}>
                                                        I accept all the terms and conditions
                                                    </FieldLabel>
                                                </div>
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
                                            Please wait
                                        </>
                                    ) : (
                                        "Sign up"
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-4 flex items-center justify-between">
                            <hr className="w-full border-gray-300" />
                            <span className="px-2 text-gray-400 text-sm">OR</span>
                            <hr className="w-full border-gray-300" />
                        </div>

                        <div className="mt-4">
                            <Button onClick={() => loginWithGoogle()}
                                variant="outline" className="w-full font-semibold flex items-center gap-2"
                            >
                                <FcGoogle className="text-xl" />
                                Continue with Google
                            </Button>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-600 dark:text-blue-600 hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default SignUp;