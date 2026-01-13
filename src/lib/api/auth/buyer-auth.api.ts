// src/lib/api/auth/buyer-auth.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import { BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";
import { BuyerSignUpSchemaType } from "@/schemas/auth/buyer/sign-up.schema.ts";
import { VerifyAccountRegistrationSchemaType } from "@/schemas/auth/buyer/verify-account-registration.schema.ts";
import { ForgotPasswordSchemaType } from "@/schemas/auth/buyer/forgot-password.schema.ts";
import { VerifyAccountResetPasswordSchemaType } from "@/schemas/auth/buyer/verify-account-reset-password.schema.ts";
import { ResetPasswordSchemaType } from "@/schemas/auth/buyer/reset-password.schema.ts";


// Sign Up Axios
export const buyerSignUp = async (signUpData: BuyerSignUpSchemaType) => {
    try {
        const response = await axios.post<BuyerResponseDtoType>(API.AUTH.BUYER.SIGN_UP, signUpData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Sign Up failed");
    }
};

// Check Username Unique Axios
export const buyerCheckUsernameUnique = async (username: string) => {
    try {
        const response = await axios.get<BuyerResponseDtoType>(API.AUTH.BUYER.CHECK_USERNAME_UNIQUE, { params: username });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Username uniqueness check failed");
    }
};

// Login With Google Axios
export const buyerLoginWithGoogle = async (tokenId: string) => {
    try {
        const response = await axios.post<BuyerResponseDtoType>(API.AUTH.BUYER.GOOGLE_LOGIN, tokenId);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Google Login failed");
    }
};

// Send Account Registration Email Axios
export const buyerSendAccountRegistrationEmail = async (email: string) => {
    try {
        const response = await axios.put<BuyerResponseDtoType>(API.AUTH.BUYER.SEND_ACCOUNT_REGISTRATION_EMAIL, email);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Sending account registration email failed");
    }
};

// Verify Account Registration Axios
export const buyerVerifyAccountRegistration = async (username: string, verifyAccountRegistrationData: VerifyAccountRegistrationSchemaType) => {
    try {
        const response = await axios.put<BuyerResponseDtoType>(API.AUTH.BUYER.VERIFY_ACCOUNT_REGISTRATION, { username, verifyAccountRegistrationData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Account registration verification failed");
    }
};

// Forgot Password Axios
export const buyerForgotPassword = async (forgotPasswordData: ForgotPasswordSchemaType) => {
    try {
        const response = await axios.put<BuyerResponseDtoType>(API.AUTH.BUYER.FORGOT_PASSWORD, forgotPasswordData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Forgot password request failed");
    }
};

// Verify Account Reset Password Axios
export const buyerVerifyAccountResetPassword = async (username: string, verifyAccountResetPasswordData: VerifyAccountResetPasswordSchemaType) => {
    try {
        const response = await axios.put<BuyerResponseDtoType>(API.AUTH.BUYER.VERIFY_ACCOUNT_RESET_PASSWORD, { username, verifyAccountResetPasswordData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Account reset password verification failed");
    }
};

// Reset Password Axios
export const buyerResetPassword = async (email: string, resetPasswordData: ResetPasswordSchemaType) => {
    try {
        const response = await axios.put<BuyerResponseDtoType>(API.AUTH.BUYER.RESET_PASSWORD, { email, resetPasswordData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Password reset failed");
    }
};