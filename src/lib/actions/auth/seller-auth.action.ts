// src/lib/actions/auth/seller-auth.action.ts
"use server";
import { sellerForgotPassword, sellerResetPassword, sellerSendAccountRegistrationEmail, sellerSignUp, sellerVerifyAccountRegistration } from "@/lib/api/auth/seller-auth.api.ts";
import { SellerSignUpSchemaType } from "@/schemas/auth/seller/sign-up.schema.ts";
import { SellerVerifyAccountRegistrationSchemaType } from "@/schemas/auth/seller/verify-account-registration.schema.ts";
import { SellerForgotPasswordSchemaType } from "@/schemas/auth/seller/forgot-password.schema.ts";
import { SellerResetPasswordSchemaType } from "@/schemas/auth/seller/reset-password.schema.ts";


// Sign Up Handler
export const handleSellerSignUp = async (signUpData: SellerSignUpSchemaType) => {
    try {
        const result = await sellerSignUp(signUpData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to register user."
            };
        }
        return {
            success: true,
            message: result.message || "User registered successfully. Please verify your email.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during sign up."
        };
    }
};

// Send Account Registration Email Handler
export const handleSellerSendAccountRegistrationEmail = async (email: string) => {
    try {
        const result = await sellerSendAccountRegistrationEmail(email);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to send account registration email."
            };
        }
        return {
            success: true,
            message: result.message || "Account registration email sent successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while sending account registration email."
        };
    }
};

// Verify Account Registration Handler
export const handleSellerVerifyAccountRegistration = async (email: string, verifyAccountRegistrationData: SellerVerifyAccountRegistrationSchemaType) => {
    try {
        const result = await sellerVerifyAccountRegistration(email, verifyAccountRegistrationData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to verify account registration."
            };
        }
        return {
            success: true,
            message: result.message || "Account registration verified successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during account registration verification."
        };
    }
};

// Forgot Password Handler
export const handleSellerForgotPassword = async (forgotPasswordData: SellerForgotPasswordSchemaType) => {
    try {
        const result = await sellerForgotPassword(forgotPasswordData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to process forgot password request."
            };
        }
        return {
            success: true,
            message: result.message || "Forgot password request processed successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during forgot password request."
        };
    }
};

// Reset Password Handler
export const handleSellerResetPassword = async (email: string, resetPasswordData: SellerResetPasswordSchemaType) => {
    try {
        const result = await sellerResetPassword(email, resetPasswordData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to reset password."
            };
        }
        return {
            success: true,
            message: result.message || "Password reset successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during password reset."
        };
    }
};