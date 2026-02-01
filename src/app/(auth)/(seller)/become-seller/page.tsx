// src/app/(auth)/(seller)/become-seller/page.tsx
"use client";
import React, { startTransition, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card.tsx";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp.tsx";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SellerSignUpSchema } from "@/schemas/auth/seller/sign-up.schema.ts";
import { SellerLoginSchema } from "@/schemas/auth/seller/login.schema.ts";
import { SellerVerifyAccountRegistrationSchema } from "@/schemas/auth/seller/verify-account-registration.schema.ts";
import { SellerForgotPasswordSchema } from "@/schemas/auth/seller/forgot-password.schema.ts";
import { SellerResetPasswordSchema } from "@/schemas/auth/seller/reset-password.schema.ts";
import { handleSellerForgotPassword, handleSellerLogin, handleSellerResetPassword, handleSellerSendAccountRegistrationEmail, handleSellerSignUp, handleSellerVerifyAccountRegistration } from "@/lib/actions/auth/seller-auth.action.ts";
import type { SellerSignUpSchemaType } from "@/schemas/auth/seller/sign-up.schema.ts";
import type { SellerLoginSchemaType } from "@/schemas/auth/seller/login.schema.ts";
import type { SellerVerifyAccountRegistrationSchemaType } from "@/schemas/auth/seller/verify-account-registration.schema.ts";
import type { SellerForgotPasswordSchemaType } from "@/schemas/auth/seller/forgot-password.schema.ts";
import type { SellerResetPasswordSchemaType } from "@/schemas/auth/seller/reset-password.schema.ts";


const VALID_TABS = new Set([
    "sign-up", "login", "verify-otp-register", "forgot-password", "reset-password"
]);

// Keys used for sessionStorage persistence
const TAB_KEY = "become-seller:tab";
const EMAIL_KEY = "become-seller:email";

const clearPersisted = () => {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.removeItem(TAB_KEY);
        sessionStorage.removeItem(EMAIL_KEY);
    } catch (e) {
        // ignore storage errors
    }
};

const BecomeSeller = () => {
    const router = useRouter();

    const [tab, setTab] = useState<string>("sign-up");
    const [email, setEmail] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showResetNewPassword, setShowResetNewPassword] = useState(false);

    const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
    const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [iSendingCode, setIsSendingCode] = useState(false);

    // safe setter that validates tab values
    const setTabSafe = (value: string) => {
        if (VALID_TABS.has(value)) setTab(value);
        else setTab("sign-up");
    };

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedTab = sessionStorage.getItem(TAB_KEY);
            if (storedTab && VALID_TABS.has(storedTab)) {
                setTab(storedTab);
            }

            const storedEmail = sessionStorage.getItem(EMAIL_KEY);
            if (storedEmail) {
                setEmail(storedEmail);
            }
        } catch (e) {
            // ignore storage errors
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist changes after mount
    useEffect(() => {
        if (!isMounted) return;
        try {
            sessionStorage.setItem(TAB_KEY, tab);
        } catch (e) {
            // ignore
        }
    }, [tab, isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        try {
            if (email) {
                sessionStorage.setItem(EMAIL_KEY, email);
            }
            else {
                sessionStorage.removeItem(EMAIL_KEY);
            }
        } catch (e) {
            // ignore
        }
    }, [email, isMounted]);

    const signUpForm = useForm<SellerSignUpSchemaType>({
        resolver: zodResolver(SellerSignUpSchema),
        defaultValues: {
            fullName: "",
            contact: "",
            email: "",
            role: "seller",
        },
    });

    const verifyAccountRegistrationForm = useForm<SellerVerifyAccountRegistrationSchemaType>({
        resolver: zodResolver(SellerVerifyAccountRegistrationSchema),
        defaultValues: {
            otp: "",
            password: "",
            confirmPassword: ""
        },
    });

    const loginForm = useForm<SellerLoginSchemaType>({
        resolver: zodResolver(SellerLoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            role: "seller"
        },
    });

    const forgotPasswordForm = useForm<SellerForgotPasswordSchemaType>({
        resolver: zodResolver(SellerForgotPasswordSchema),
        defaultValues: {
            email: ""
        },
    });

    const resetPasswordForm = useForm<SellerResetPasswordSchemaType>({
        resolver: zodResolver(SellerResetPasswordSchema),
        defaultValues: {
            otp: "",
            newPassword: "",
            confirmPassword: ""
        },
    });

    useEffect(() => {
        signUpForm.reset();
    }, [tab, signUpForm]);
    useEffect(() => {
        verifyAccountRegistrationForm.reset();
    }, [tab, verifyAccountRegistrationForm]);
    useEffect(() => {
        loginForm.reset();
    }, [tab, loginForm]);
    useEffect(() => {
        forgotPasswordForm.reset();
    }, [tab, forgotPasswordForm]);
    useEffect(() => {
        resetPasswordForm.reset();
    }, [tab, resetPasswordForm]);

    const handleSignUp = async (data: SellerSignUpSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleSellerSignUp(data);
            if (!response.success) {
                toast.error("Sign Up Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Sign Up Successful", {
                description: response.message,
            });
            setEmail(data.email);
            setTabSafe("verify-otp-register");
        }
        catch (error: Error | any) {
            console.error("Error in sign up of user: ", error);
            toast.error("Error signing up the user", {
                description: error.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAccountRegistration = async (data: SellerVerifyAccountRegistrationSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleSellerVerifyAccountRegistration(email, data);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Success", {
                description: response.message,
            });
            setEmail("");
            setTabSafe("login");
        }
        catch (error: Error | any) {
            console.error("Error verifying OTP for user registration: ", error);
            toast.error("Error verifying OTP for user registration", {
                description: error.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (data: SellerLoginSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleSellerLogin(data);
            const user = response.data;

            if (!response.success || !user) {
                toast.error("Login failed", {
                    description: response.message,
                });
                return;
            }

            if (user.isVerified || user.role === "seller") {
                if (user.role !== "seller") {
                    toast.error("Role error!", {
                        description: response.message || "Incorrect role from response!",
                    });
                    return;
                }

                toast.success("Login Successful", {
                    description: response.message,
                });
                startTransition(() => router.replace("/seller/dashboard"));
                return;
            }
            else {
                toast.warning("Account Not Verified", {
                    description: "Do you want to verify your account?",
                    action: {
                        label: "Yes",
                        onClick: () => {
                            setEmail(user.email);
                            setDialogOpen(true);
                        }
                    }
                });
                return;
            }
        }
        catch (error: Error | any) {
            console.error("Error in seller user login: ", error);
            toast.error("Error in seller user login", {
                description: error.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (data: SellerForgotPasswordSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleSellerForgotPassword(data);
            if (!response.success) {
                console.error("Failed to send forgot password request: ", response.message);
                toast.error("Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            setEmail(data.email);
            setTabSafe("reset-password");
        }
        catch (error: Error | any) {
            console.error("Error sending forgot password request", error);
            toast.error("Failed", {
                description: error.message || "Failed to send reset instructions",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (data: SellerResetPasswordSchemaType) => {
        setIsSubmitting(true);
        try {
            const response = await handleSellerResetPassword(email, data);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message.toString(),
                });
                return;
            }

            toast.success("Success", {
                description: response.message,
            });
            setEmail("");
            setTabSafe("login");
        }
        catch (error: Error | any) {
            console.error("Error in verifying OTP for reseting password: ", error);
            toast.error("Failed to verify OTP", {
                description: error.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const sendAccountVerificationCode = async () => {
        setIsSendingCode(true);
        try {
            const response = await handleSellerSendAccountRegistrationEmail(email);
            if (!response.success) {
                toast.error("Failed", {
                    description: response.message,
                });
                return;
            }

            toast.success("Success", {
                description: response.message
            });
            setTabSafe("verify-otp-register");
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

    const toggleSignUpPasswordVisibility = () => setShowSignUpPassword((prev) => !prev);
    const toggleLoginPasswordVisibility = () => setShowLoginPassword((prev) => !prev);
    const toggleResetNewPasswordVisibility = () => setShowResetNewPassword((prev) => !prev);

    const toggleSignUpConfirmPasswordVisibility = () => setShowSignUpConfirmPassword((prev) => !prev);
    const toggleResetConfirmPasswordVisibility = () => setShowResetConfirmPassword((prev) => !prev);

    return (
        <section className="min-h-screen flex items-center justify-center px-5 py-15 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900 border">
                <div>
                    <Button
                        variant="ghost"
                        className="relative top-2 left-2 text-gray-600 dark:text-gray-400 hover:text-blue-950 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => {
                            clearPersisted();
                            router.push("/");
                        }}
                        aria-label="Back to home"
                    >
                        <ArrowLeft size={24} />
                    </Button>
                </div>
                <Card className="border-0 grid md:grid-cols-2 shadow-none">
                    {/* Left banner section */}
                    <div className="hidden md:flex flex-col justify-center bg-green-600 text-white px-10 py-12 space-y-4">
                        <h1 className="text-4xl font-extrabold leading-tight">
                            Grow Your Business <br /> With Leelame!
                        </h1>
                        <p className="text-lg opacity-90">
                            Join our seller network and reach thousands of buyers every day.
                        </p>
                        <div className="flex items-center gap-6 mt-6">
                            <div>
                                <h2 className="text-3xl font-bold">0%</h2>
                                <p className="text-sm opacity-80">Commission for first 30 days</p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">5M+</h2>
                                <p className="text-sm opacity-80">Active buyers on Leelame</p>
                            </div>
                        </div>
                    </div>

                    {/* Right form section */}
                    <CardContent className="flex flex-col justify-center p-8">
                        {/* Sign Up and Login */}
                        {(tab === "sign-up" || tab === "login") && (
                            <Tabs value={tab} onValueChange={setTabSafe}>
                                <TabsList className="grid grid-cols-2 mb-6 w-full">
                                    <TabsTrigger value="sign-up">Sign up</TabsTrigger>
                                    <TabsTrigger value="login">Login</TabsTrigger>
                                </TabsList>

                                {/* Sign Up */}
                                <TabsContent value="sign-up">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle>Sign up as a Leelame Seller</CardTitle>
                                        <CardDescription>
                                            Already have an account?{" "}
                                            <button
                                                onClick={() => setTabSafe("login")}
                                                className="text-green-500 hover:underline cursor-pointer"
                                            >
                                                Log in
                                            </button>
                                        </CardDescription>
                                    </CardHeader>

                                    <form
                                        id="sign-up-form"
                                        onSubmit={signUpForm.handleSubmit(handleSignUp)}
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
                                                name="contact"
                                                control={signUpForm.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor={field.name}>
                                                            Mobile Number
                                                        </FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id={field.name}
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="Mobile Number"
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
                                                            Email
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
                                        </FieldGroup>
                                        <div className="flex justify-center">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Please wait...
                                                    </>
                                                ) : (
                                                    "Sign up"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>

                                {/* Login */}
                                <TabsContent value="login">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle>Login with Password</CardTitle>
                                        <CardDescription>
                                            Don’t have an account?{" "}
                                            <button
                                                onClick={() => setTabSafe("sign-up")}
                                                className="text-green-500 hover:underline cursor-pointer"
                                            >
                                                Create
                                            </button>
                                        </CardDescription>
                                    </CardHeader>

                                    <form
                                        id="login-form"
                                        onSubmit={loginForm.handleSubmit(handleLogin)}
                                        className="space-y-6"
                                    >
                                        <FieldGroup>
                                            <Controller
                                                name="identifier"
                                                control={loginForm.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor={field.name}>
                                                            Mobile Number/Email
                                                        </FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id={field.name}
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="Mobile Number or Email"
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
                                                                    showLoginPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={toggleLoginPasswordVisibility}
                                                                className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                                            >
                                                                {showLoginPassword ? (
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
                                            <button
                                                type="button"
                                                onClick={() => setTabSafe("forgot-password")}
                                                className="text-green-500 hover:underline cursor-pointer"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="flex justify-center">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Please wait...
                                                    </>
                                                ) : (
                                                    "Login"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        )}

                        {/* Verify (OTP) Account for Registration */}
                        {tab === "verify-otp-register" && (
                            <>
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle>Verify Your Account</CardTitle>
                                    <CardDescription>
                                        Enter the OTP for account registration.
                                    </CardDescription>
                                </CardHeader>

                                <form
                                    id="verify-account-registration-form"
                                    onSubmit={verifyAccountRegistrationForm.handleSubmit(handleVerifyAccountRegistration)}
                                    className="space-y-8"
                                >
                                    <FieldGroup>
                                        <Controller
                                            name="otp"
                                            control={verifyAccountRegistrationForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Verification Code
                                                    </FieldLabel>
                                                    <div className="flex justify-center">
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

                                        <Controller
                                            name="password"
                                            control={verifyAccountRegistrationForm.control}
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
                                                                showSignUpPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={toggleSignUpPasswordVisibility}
                                                            className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                                        >
                                                            {showSignUpPassword ? (
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
                                            control={verifyAccountRegistrationForm.control}
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
                                                                showSignUpConfirmPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={toggleSignUpConfirmPasswordVisibility}
                                                            className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                                        >
                                                            {showSignUpConfirmPassword ? (
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
                                            className="flex-1 w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Next"
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            className="flex-1 font-semibold"
                                            variant="outline"
                                            onClick={() => setTabSafe("sign-up")}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Forgot Password */}
                        {tab === "forgot-password" && (
                            <>
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle>Forgot Password</CardTitle>
                                    <CardDescription>
                                        Enter your registered email to receive an OTP.
                                    </CardDescription>
                                </CardHeader>

                                <form
                                    id="forgot-password-form"
                                    onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
                                    className="space-y-6"
                                >
                                    <FieldGroup>
                                        <Controller
                                            name="email"
                                            control={forgotPasswordForm.control}
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
                                                    // autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                    <div className="flex justify-center">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Please wait...
                                                </>
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </Button>
                                    </div>

                                    <button
                                        onClick={() => setTabSafe("login")}
                                        type="button"
                                        className="text-sm text-green-500 hover:underline block text-center w-full cursor-pointer"
                                    >
                                        Back to Login
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Verify (OTP) Account for Reset Password */}
                        {tab === "reset-password" && (
                            <>
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle>Verify OTP</CardTitle>
                                    <CardDescription>
                                        Enter the OTP for reset password.
                                    </CardDescription>
                                </CardHeader>

                                <form
                                    id="reset-password-form"
                                    onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
                                    className="space-y-8"
                                >
                                    <FieldGroup>
                                        <Controller
                                            name="otp"
                                            control={resetPasswordForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Verification Code
                                                    </FieldLabel>
                                                    <div className="flex justify-center">
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

                                        <Controller
                                            name="newPassword"
                                            control={resetPasswordForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        New Password
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            id={field.name}
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="New Password"
                                                            autoComplete="off"
                                                            type={
                                                                showResetNewPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={toggleResetNewPasswordVisibility}
                                                            className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                                        >
                                                            {showResetNewPassword ? (
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
                                                                showResetConfirmPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={toggleResetConfirmPasswordVisibility}
                                                            className="cursor-pointer absolute inset-y-0 end-2.5 text-gray-400 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:focus:text-blue-500"
                                                        >
                                                            {showResetConfirmPassword ? (
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

                                    <Button
                                        type="submit"
                                        className="flex-1 w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isSubmitting}
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
                                    <button
                                        onClick={() => {
                                            setTabSafe("login");
                                        }}
                                        type="button"
                                        className="text-sm text-green-500 hover:underline block text-center w-full cursor-pointer"
                                    >
                                        Back to Login
                                    </button>
                                </form>
                            </>
                        )}

                        <Separator className="my-4" />
                        <p className="text-xs text-center text-muted-foreground">
                            By clicking, you agree to our{" "}
                            <span className="text-green-500">Terms & Conditions</span> and{" "}
                            <span className="text-green-500">Privacy Policy</span>.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ---------------------------- Verify Dialog ------------------------------- */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Your Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">Email</Label>
                            <Input
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
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

export default BecomeSeller;