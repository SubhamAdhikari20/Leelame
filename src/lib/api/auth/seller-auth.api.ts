// src/lib/api/auth/seller-auth.api.ts
import axios from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AxiosErrorType } from "@/lib/api/axios.ts";
import type { SellerResponseDtoType } from "@/dtos/seller.dto.ts";
import type { SellerSignUpSchemaType } from "@/schemas/auth/seller/sign-up.schema.ts";
import type { SellerVerifyAccountRegistrationSchemaType } from "@/schemas/auth/seller/verify-account-registration.schema.ts";
import type { SellerForgotPasswordSchemaType } from "@/schemas/auth/seller/forgot-password.schema.ts";
import type { SellerResetPasswordSchemaType } from "@/schemas/auth/seller/reset-password.schema.ts";


// Sign Up Axios
export const sellerSignUp = async (signUpData: SellerSignUpSchemaType) => {
    try {
        const response = await axios.post<SellerResponseDtoType>(API.AUTH.SELLER.SIGN_UP, signUpData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        console.error(axiosError);
        throw new Error(axiosError.response?.data.message || "Sign Up failed");
    }
};

// Send Account Registration Email Axios
export const sellerSendAccountRegistrationEmail = async (email: string) => {
    try {
        const response = await axios.put<SellerResponseDtoType>(API.AUTH.SELLER.SEND_ACCOUNT_REGISTRATION_EMAIL, email);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Sending account registration email failed");
    }
};

// Verify Account Registration Axios
export const sellerVerifyAccountRegistration = async (email: string, verifyAccountRegistrationData: SellerVerifyAccountRegistrationSchemaType) => {
    try {
        const response = await axios.put<SellerResponseDtoType>(API.AUTH.SELLER.VERIFY_ACCOUNT_REGISTRATION, { email, ...verifyAccountRegistrationData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Account registration verification failed");
    }
};

// Forgot Password Axios
export const sellerForgotPassword = async (forgotPasswordData: SellerForgotPasswordSchemaType) => {
    try {
        const response = await axios.put<SellerResponseDtoType>(API.AUTH.SELLER.FORGOT_PASSWORD, forgotPasswordData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Forgot password request failed");
    }
};

// Reset Password Axios
export const sellerResetPassword = async (email: string, resetPasswordData: SellerResetPasswordSchemaType) => {
    try {
        const response = await axios.put<SellerResponseDtoType>(API.AUTH.SELLER.RESET_PASSWORD, { email, ...resetPasswordData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Password reset failed");
    }
};