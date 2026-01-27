// src/lib/actions/auth/admin-auth.action.ts
"use server";
import { adminForgotPassword, adminResetPassword, adminSendAccountRegistrationEmail, adminSignUp, adminVerifyAccountRegistration, adminVerifyAccountResetPassword } from "@/lib/api/auth/admin-auth.api.ts";
import type { AdminForgotPasswordSchemaType } from "@/schemas/auth/admin/forgot-password.schema.ts";
import type { AdminSignUpSchemaType } from "@/schemas/auth/admin/sign-up.schema.ts";
import type { AdminVerifyAccountRegistrationSchemaType } from "@/schemas/auth/admin/verify-account-registration.schema.ts";
import type { AdminVerifyAccountResetPasswordSchemaType } from "@/schemas/auth/admin/verify-account-reset-password.schema.ts";
import type { AdminResetPasswordSchemaType } from "@/schemas/auth/admin/reset-password.schema.ts";
import type { UserData } from "@/lib/cookie.ts";
import { setAuthToken, setUserData } from "@/lib/cookie.ts";


// Sign Up Handler
export const handleAdminSignUp = async (signUpData: AdminSignUpSchemaType) => {
    try {
        const result = await adminSignUp(signUpData);
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
export const handleAdminSendAccountRegistrationEmail = async (email: string) => {
    try {
        const result = await adminSendAccountRegistrationEmail(email);
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
export const handleAdminVerifyAccountRegistration = async (username: string, verifyAccountRegistrationData: AdminVerifyAccountRegistrationSchemaType) => {
    try {
        const result = await adminVerifyAccountRegistration(username, verifyAccountRegistrationData);
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

// Login Token and Set Cookies Handler
export const handleAdminLoginTokenAndSetCookies = async (token: string, userData: UserData) => {
    try {
        await setAuthToken(token);
        await setUserData(userData);
        return {
            success: true,
            message: "Authentication cookies set successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while setting authentication cookies."
        };
    }
};

// Forgot Password Handler
export const handleAdminForgotPassword = async (forgotPasswordData: AdminForgotPasswordSchemaType) => {
    try {
        const result = await adminForgotPassword(forgotPasswordData);
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
export const handleAdminVerifyAccountResetPassword = async (email: string, verifyAccountResetPasswordData: AdminVerifyAccountResetPasswordSchemaType) => {
    try {
        const result = await adminVerifyAccountResetPassword(email, verifyAccountResetPasswordData);
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
export const handleAdminResetPassword = async (email: string, resetPasswordData: AdminResetPasswordSchemaType) => {
    try {
        const result = await adminResetPassword(email, resetPasswordData);
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