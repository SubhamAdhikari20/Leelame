// src/app/(auth)/admin/login/page.tsx
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
import { handleAdminLogin, handleAdminSendAccountRegistrationEmail } from "@/lib/actions/auth/admin-auth.action.ts";
import { AdminLoginSchema } from "@/schemas/auth/admin/login.schema.ts";
import type { AdminLoginSchemaType } from "@/schemas/auth/admin/login.schema.ts";


const AdminLogin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // OTP dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState("");
    const [iSendingCode, setIsSendingCode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const loginForm = useForm<AdminLoginSchemaType>({
        resolver: zodResolver(AdminLoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            role: "admin"
        },
    });

    // Login
    const onSubmit = async (data: AdminLoginSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleAdminLogin(data);
            const user = response.data;

            if (!response.success || !user) {
                toast.error("Login failed", {
                    description: response.message,
                });
                return;
            }

            if (user.isVerified || user.role === "admin") {
                if (user.role !== "admin") {
                    toast.error("Role error!", {
                        description: response.message || "Incorrect role from response!",
                    });
                    return;
                }

                toast.success("Login Successful", {
                    description: response.message,
                });
                startTransition(() => router.replace("/admin/dashboard"));
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

    const sendAccountVerificationCode = async () => {
        setIsSendingCode(true);
        try {
            const response = await handleAdminSendAccountRegistrationEmail(emailToVerify);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message
                });
                return;
            }
            toast.success("Success", {
                description: response.message
            });
            const admin = response.data;
            startTransition(() => router.replace(`/verify-account/registration?email=${admin?.email}`));
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
        <section className="min-h-screen flex items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
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
                            Admin
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Login to access admin portal
                        </p>
                    </div>

                    <div>
                        <form
                            id="admin-login-form"
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
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Email"
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

                        <div className="text-center mt-5">
                            <p className="text-sm">
                                Don't have an account?{" "}
                                <Link
                                    href="/admin/sign-up"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── VERIFY DIALOG ───────────────────────────────────── */}
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

export default AdminLogin;