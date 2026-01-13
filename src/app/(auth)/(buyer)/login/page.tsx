// src/app/(auth)/(buyer)/login/page.tsx
"use client";
import React, { startTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"
import { useGoogleLogin } from "@react-oauth/google";
import { getSession, signIn } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { BuyerLoginSchema, BuyerLoginSchemaType } from "@/schemas/auth/buyer/login.schema.ts";
import { BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";
import { handleBuyerLoginWithGoogle, handleBuyerSendAccountRegistrationEmail } from "@/lib/actions/auth/buyer-auth.action.ts";


const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // OTP dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState("");
    const [iSendingCode, setIsSendingCode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const loginForm = useForm<BuyerLoginSchemaType>({
        resolver: zodResolver(BuyerLoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            role: "buyer"
        },
    });

    // Login
    const onSubmit = async (data: BuyerLoginSchemaType) => {
        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", {
                identifier: data.identifier,
                password: data.password,
                role: data.role,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Login failed", { description: result.error ?? "Unknown error!" });
                return;

                // switch (result.error) {
                //     case "MISSING_CREDENTIALS":
                //         toast.error("Login Failed", { description: "Please enter both username or email and password." });
                //         break;
                //     case "BUYER_NOT_FOUND":
                //         toast.error("Login Failed", { description: "Invalid username or email." });
                //         break;
                //     case "INVALID_PASSWORD":
                //         toast.error("Login Failed", { description: "Invalid password. Please enter correct password." });
                //         break;
                //     default:
                //         toast.error("Login failed", { description: result.error });
                // }
                // return;

                // if ((result.error == "CredentialsSignIn") || (result.error == "CredentialsSignin")) {
                //     toast.error("Login Failed", {
                //         description: "Incorrect username or password"
                //     });
                // }
                // else {
                //     toast.error("Error", {
                //         description: result.error
                //     });
                //     console.error(result.error);
                // }
                // return;
            }

            const updatedSession = await getSession();

            if (!updatedSession) {
                toast.error("Session not found.");
                return;
            }

            const { user } = updatedSession;

            if (user.isVerified) {
                toast.success("Login Successful", {
                    description: `Logged in as ${user.role}`
                });
                if (user.role === "buyer") {
                    startTransition(() => router.replace(`/${user.username}`));
                    return;
                }
                return;
            }
            else {
                toast.warning("Account Not Verified", {
                    description: "Do you want to verify your account?",
                    action: {
                        label: "Yes",
                        onClick: () => {
                            setEmailToVerify(user.email);
                            setDialogOpen(true);
                        }
                    }
                });
                return;
            }
        }
        catch (error: Error | any) {
            console.error("Error in user login: ", error);
            toast.error("Error in user login", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await handleBuyerLoginWithGoogle(tokenResponse.access_token);

                if (response.success) {
                    toast.error("Google Login Failed", {
                        description: response.message,
                    });
                    return;
                }

                toast.success("Google Login Successful", {
                    description: response.message,
                });
                startTransition(() => router.replace("/"));
            }
            catch (error) {
                const axiosError = error as AxiosError<BuyerResponseDtoType>;
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

    const sendAccountVerificationCode = async () => {
        setIsSendingCode(true);
        try {
            const response = await handleBuyerSendAccountRegistrationEmail(emailToVerify);
            if (!response.success || response.data == null) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            const buyer = response.data;
            startTransition(() => router.replace(`/verify-account/registration?username=${buyer?.username}`));
        }
        catch (error: Error | any) {
            console.error("Error sending account verification email: ", error);
            toast.error("Error sending account verification email", {
                description: error.message
            });
        }
        finally {
            setIsSendingCode(false);
        }
    };

    // State to control password visibility
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <section className="flex items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
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
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100">
                            Leelame
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Login to start your bidding adventure
                        </p>
                    </div>

                    <div>
                        <form
                            id="login-form"
                            onSubmit={loginForm.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <Controller
                                    name="identifier"
                                    control={loginForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Username/Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Username or Email"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="password"
                                    control={loginForm.control}
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
                            </FieldGroup>
                            <div className="text-sm text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="flex justify-center">
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
                                        "Login"
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

                        <div className="text-center mt-5">
                            <p className="text-sm">
                                Don't have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --------------------------- Verify Account Dialog ---------------------------*/}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Your Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">Email</Label>
                            <Input
                                value={emailToVerify}
                                onChange={(e) =>
                                    setEmailToVerify(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={sendAccountVerificationCode}
                                disabled={iSendingCode}
                                className="flex-1 font-semibold"
                            >
                                {iSendingCode && (
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                )}
                                Send Code
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Login;