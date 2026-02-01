// src/lib/actions/auth/seller-auth.action.ts
"use server";
import { sellerForgotPassword, sellerLogin, sellerResetPassword, sellerSendAccountRegistrationEmail, sellerSignUp, sellerVerifyAccountRegistration } from "@/lib/api/auth/seller-auth.api.ts";
import type { SellerSignUpSchemaType } from "@/schemas/auth/seller/sign-up.schema.ts";
import type { SellerVerifyAccountRegistrationSchemaType } from "@/schemas/auth/seller/verify-account-registration.schema.ts";
import type { SellerLoginSchemaType } from "@/schemas/auth/seller/login.schema.ts";
import type { SellerForgotPasswordSchemaType } from "@/schemas/auth/seller/forgot-password.schema.ts";
import type { SellerResetPasswordSchemaType } from "@/schemas/auth/seller/reset-password.schema.ts";
import { setAuthToken, setUserData, clearAuthCookies } from "@/lib/cookie.ts"


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

// Clear Auth Cookies Handler
export const handleClearSellerAuthCookies = async () => {
    try {
        await clearAuthCookies();
        return {
            success: true,
            message: "Authentication cookies cleared successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while clearing authentication cookies."
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

// Login Token and Set Cookies Handler
export const handleSellerLoginTokenAndSetCookies = async (token: string, userData: any) => {
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

// Login handler
export const handleSellerLogin = async (loginData: SellerLoginSchemaType) => {
    try {
        const result = await sellerLogin(loginData);
        const user = result.user;

        if (!result.success || !user) {
            return {
                success: false,
                message: result.message || "Failed to login user."
            };
        }

        if (!result.token) {
            return {
                success: false,
                message: result.message || "Access token not found."
            };
        }

        const tokenResponse = await handleSellerLoginTokenAndSetCookies(result.token, user);
        if (!tokenResponse.success) {
            return {
                success: false,
                message: result.message || "Failed to set authentication cookies"
            };
        }

        return {
            success: true,
            message: result.message || "User logged in successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during login."
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

// Logout
export const handleSellerLogout = async () => {
    try {
        await clearAuthCookies();
        return {
            success: true,
            message: "Authentication cookies deleted successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while logging out and deleting authentication cookies."
        };
    }
}