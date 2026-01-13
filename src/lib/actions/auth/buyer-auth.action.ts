// src/lib/actions/auth/buyer-auth.action.ts
"use server";
import { buyerCheckUsernameUnique, buyerForgotPassword, buyerLoginWithGoogle, buyerResetPassword, buyerSendAccountRegistrationEmail, buyerSignUp, buyerVerifyAccountRegistration, buyerVerifyAccountResetPassword } from "@/lib/api/auth/buyer-auth.api.ts";
import { ForgotPasswordSchemaType } from "@/schemas/auth/buyer/forgot-password.schema.ts";
import { BuyerSignUpSchemaType } from "@/schemas/auth/buyer/sign-up.schema.ts";
import { VerifyAccountRegistrationSchemaType } from "@/schemas/auth/buyer/verify-account-registration.schema.ts";
import { VerifyAccountResetPasswordSchemaType } from "@/schemas/auth/buyer/verify-account-reset-password.schema.ts";
import { ResetPasswordSchemaType } from "@/schemas/auth/buyer/reset-password.schema.ts";


// Sign Up Handler
export const handleBuyerSignUp = async (signUpData: BuyerSignUpSchemaType) => {
    try {
        const result = await buyerSignUp(signUpData);
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

// Check Username Unique Handler
export const handleBuyerCheckUsernameUnique = async (username: string) => {
    try {
        const result = await buyerCheckUsernameUnique(username);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Error checking username uniqueness."
            };
        }
        return {
            success: true,
            message: result.message
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while checking username uniqueness."
        };
    }
};

// Login With Google Handler
export const handleBuyerLoginWithGoogle = async (tokenId: string) => {
    try {
        const result = await buyerLoginWithGoogle(tokenId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to login with Google."
            };
        }
        return {
            success: true,
            message: result.message || "Login successful.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during Google login."
        };
    }
};

// Send Account Registration Email Handler
export const handleBuyerSendAccountRegistrationEmail = async (email: string) => {
    try {
        const result = await buyerSendAccountRegistrationEmail(email);
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
export const handleBuyerVerifyAccountRegistration = async (username: string, verifyAccountRegistrationData: VerifyAccountRegistrationSchemaType) => {
    try {
        const result = await buyerVerifyAccountRegistration(username, verifyAccountRegistrationData);
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
export const handleBuyerForgotPassword = async (forgotPasswordData: ForgotPasswordSchemaType) => {
    try {
        const result = await buyerForgotPassword(forgotPasswordData);
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

// Verify Account Reset Password Handler
export const handleBuyerVerifyAccountResetPassword = async (email: string, verifyAccountResetPasswordData: VerifyAccountResetPasswordSchemaType) => {
    try {
        const result = await buyerVerifyAccountResetPassword(email, verifyAccountResetPasswordData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to verify account reset password."
            };
        }
        return {
            success: true,
            message: result.message || "Account reset password verified successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during account reset password verification."
        };
    }
};

// Reset Password Handler
export const handleBuyerResetPassword = async (email: string, resetPasswordData: ResetPasswordSchemaType) => {
    try {
        const result = await buyerResetPassword(email, resetPasswordData);
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