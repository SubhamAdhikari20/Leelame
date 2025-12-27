// src/app/(auth)/(seller)/become-seller/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Field,
    FieldDescription,
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
// import { verifyAccountRegistrationSchema } from "@/schemas/auth/verifyAccountRegistrationSchema.js";
// import { forgotPasswordSchema } from "@/schemas/auth/forgotPasswordSchema.js";
// import { verifyAccountResetPasswordSchema } from "@/schemas/auth/verifyAccountResetPasswordSchema.js";
// import { resetPasswordSchema } from "@/schemas/auth/resetPasswordSchema.js";
import axios, { AxiosError } from "axios";
import { SellerResponseDtoType } from "@/dtos/seller.dto.ts";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sellerSignUpSchema } from "@/schemas/auth/seller/sign-up.schema.ts";
import { sellerLoginSchema } from "@/schemas/auth/seller/login.schema.ts";
import { sellerVerifyAccountRegistrationSchema } from "@/schemas/auth/seller/verify-account-registration.schema.ts";
import { sellerForgotPasswordSchema } from "@/schemas/auth/seller/forgot-password.schema.ts";
import { sellerResetPasswordSchema } from "@/schemas/auth/seller/reset-password.schema.ts";
import { getSession, signIn } from "next-auth/react";


const BecomeSeller = () => {
    const [tab, setTab] = useState("sign-up");
    const [otpSent, setOtpSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState("");
    const [iSendingCode, setIsSendingCode] = useState(false);

    const router = useRouter();

    const loginForm = useForm<z.infer<typeof sellerLoginSchema>>({
        resolver: zodResolver(sellerLoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            role: "seller"
        },
    });

    const signUpForm = useForm<z.infer<typeof sellerSignUpSchema>>({
        resolver: zodResolver(sellerSignUpSchema),
        defaultValues: {
            fullName: "",
            contact: "",
            email: "",
            role: "buyer",
        },
    });

    const verifyAccountRegistrationForm = useForm<z.infer<typeof sellerVerifyAccountRegistrationSchema>>({
        resolver: zodResolver(sellerVerifyAccountRegistrationSchema),
        defaultValues: {
            code: "",
            password: "",
            confirmPassword: ""
        },
    });

    const forgotPasswordForm = useForm({
        resolver: zodResolver(sellerForgotPasswordSchema),
        defaultValues: {
            email: ""
        },
    });

    const resetPasswordForm = useForm({
        resolver: zodResolver(sellerResetPasswordSchema),
        defaultValues: {
            code: "",
            newPassword: "",
            confirmPassword: ""
        },
    });

    const handleSignUp = async (data: z.infer<typeof sellerSignUpSchema>) => {
        // setTab("verify-otp-register");
        setIsSubmitting(true);
        try {
            const response = await axios.post<SellerResponseDtoType>("/api/users/seller/sign-up", data);
            if (response.data.success) {
                toast.success("Sign Up Successful", {
                    description: response.data.message,
                });
                setTab("verify-otp-register");
            }

            toast.success("Sign Up Failed", {
                description: response.data.message,
            });
        }
        catch (error) {
            const axiosError = error as AxiosError<SellerResponseDtoType>;
            console.error("Error in sign up of user: ", axiosError);
            toast.error("Error signing up the user", {
                description: axiosError.response?.data.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAccountRegistration = async (data: z.infer<typeof sellerVerifyAccountRegistrationSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<SellerResponseDtoType>("/api/users/seller/sign-up", data);

            if (response.data.success) {
                toast.success("Success", {
                    description: response.data.message,
                });
                setTab("login");
                // setOtpSent(false);
            }

            toast.success("Failed", {
                description: response.data.message,
            });
        }
        catch (error) {
            const axiosError = error as AxiosError<SellerResponseDtoType>;
            console.error("Error verifying OTP for user registration: ", axiosError);
            toast.error("Error verifying OTP for user registration", {
                description: axiosError.response?.data.message,
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (data: z.infer<typeof sellerLoginSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
                role: data.role,
            });

            if (result?.error) {
                switch (result.error) {
                    case "MISSING_CREDENTIALS":
                        toast.error("Login Failed", { description: "Please enter both username/email and password." });
                        break;
                    case "BUYER_NOT_FOUND":
                        toast.error("Login Failed", { description: "Invalid username or email." });
                        break;
                    case "INVALID_PASSWORD":
                        toast.error("Login Failed", { description: "Invalid password. Please enter correct password." });
                        break;
                    default:
                        toast.error("Login failed", { description: result.error });
                }
                return;
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
                if (user.role === "seller") {
                    router.replace(`/seller/${user._id}`);
                }
            }
            else {
                toast.warning('Account Not Verified', {
                    description: `Do you want to verify your account?`,
                    action: {
                        label: "Yes",
                        onClick: () => {
                            setEmailToVerify(user.email);
                            setDialogOpen(true);
                        }
                    }
                });
            }
        }
        catch (error) {
            const axiosError = error as AxiosError<SellerResponseDtoType>;
            console.error("Error in user login: ", axiosError);
            toast.error("Error in user login", {
                description: axiosError.response?.data.message
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const sendAccountVerificationCode = async () => {
        setIsSendingCode(true);
        try {
            const response = await axios.put<SellerResponseDtoType>("/api/users/seller/send-account-registration-email", {
                email: emailToVerify,
            });

            if (response.data.success) {
                toast.success("Success", {
                    description: response.data.message
                });
                setTab("verify-otp-register");
            }

            toast.success("Failed", {
                description: response.data.message,
            });
        }
        catch (error) {
            const axiosError = error as AxiosError<SellerResponseDtoType>;
            console.error("Error sending account verification email: ", axiosError);
            toast.error("Error sending account verification email", {
                description: axiosError.response?.data.message
            });
        }
        finally {
            setIsSendingCode(false);
        }
    };

    const handleForgotPassword = async (data: z.infer<typeof sellerForgotPasswordSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.put<SellerResponseDtoType>("/api/users/seller/forgot-password", {
                email: data.email,
            });

            if (response.data.success) {
                toast.success("Success", {
                    description: response.data.message
                });

                setTab("reset-password");
            }

            toast.success("Failed", {
                description: response.data.message,
            });
        }
        catch (error) {
            const axiosError = error as AxiosError<SellerResponseDtoType>;
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

        toast.success(`OTP sent to ${data.email}`);
        setOtpSent(true);
    };


    const handleResetPassword = (data: z.infer<typeof sellerResetPasswordSchema>) => {
        setOtpSent(false);
        setTab("login");
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    return (
        <section className="min-h-screen flex items-center justify-center px-5 py-15 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900 border">
                <div>
                    <Button
                        variant="ghost"
                        className="relative top-2 left-2 text-gray-600 dark:text-gray-400 hover:text-blue-950 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => router.push("/")}
                        aria-label="Back to home"
                    >
                        <ArrowLeft size={24} />
                    </Button>
                </div>
                <Card className="border-0 grid md:grid-cols-2">
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
                            <Tabs value={tab} onValueChange={setTab}>
                                <TabsList className="grid grid-cols-2 mb-6 w-full">
                                    <TabsTrigger value="sign-up">Sign up</TabsTrigger>
                                    <TabsTrigger value="login">Login</TabsTrigger>
                                </TabsList>

                                {/* Signup */}
                                <TabsContent value="sign-up">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle>Sign up as a Leelame Seller</CardTitle>
                                        <CardDescription>
                                            Already have an account?{" "}
                                            <button
                                                onClick={() => setTab("login")}
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
                                                onClick={() => setTab("sign-up")}
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
                                            <button
                                                type="button"
                                                onClick={() => setTab("forgot-password")}
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
                                            name="code"
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
                                            onClick={() => setTab("sign-up")}
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
                                        onClick={() => setTab("login")}
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
                                            name="code"
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
                                            setOtpSent(false);
                                            setTab("login");
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

            {/* ───--------------------- VERIFY DIALOG ----------------------------- */}
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

export default BecomeSeller;