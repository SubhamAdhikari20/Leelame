// src/lib/api/auth/admin-auth.api.ts
import axios from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AxiosErrorType } from "@/lib/api/axios.ts";
import type { AdminResponseDtoType } from "@/dtos/admin.dto.ts";
import type { AdminSignUpSchemaType } from "@/schemas/auth/admin/sign-up.schema.ts";
import type { AdminVerifyAccountRegistrationSchemaType } from "@/schemas/auth/admin/verify-account-registration.schema.ts";
import type { AdminForgotPasswordSchemaType } from "@/schemas/auth/admin/forgot-password.schema.ts";
import type { AdminVerifyAccountResetPasswordSchemaType } from "@/schemas/auth/admin/verify-account-reset-password.schema.ts";
import type { AdminResetPasswordSchemaType } from "@/schemas/auth/admin/reset-password.schema.ts";


// Sign Up Axios
export const adminSignUp = async (signUpData: AdminSignUpSchemaType) => {
    try {
        const response = await axios.post<AdminResponseDtoType>(API.AUTH.ADMIN.SIGN_UP, signUpData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Sign Up failed");
    }
};

// Send Account Registration Email Axios
export const adminSendAccountRegistrationEmail = async (email: string) => {
    try {
        const response = await axios.put<AdminResponseDtoType>(API.AUTH.ADMIN.SEND_ACCOUNT_REGISTRATION_EMAIL, email);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Sending account registration email failed");
    }
};

// Verify Account Registration Axios
export const adminVerifyAccountRegistration = async (username: string, verifyAccountRegistrationData: AdminVerifyAccountRegistrationSchemaType) => {
    try {
        const response = await axios.put<AdminResponseDtoType>(API.AUTH.ADMIN.VERIFY_ACCOUNT_REGISTRATION, { username, ...verifyAccountRegistrationData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Account registration verification failed");
    }
};

// Forgot Password Axios
export const adminForgotPassword = async (forgotPasswordData: AdminForgotPasswordSchemaType) => {
    try {
        const response = await axios.put<AdminResponseDtoType>(API.AUTH.ADMIN.FORGOT_PASSWORD, forgotPasswordData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Forgot password request failed");
    }
};

// Verify Account Reset Password Axios
export const adminVerifyAccountResetPassword = async (username: string, verifyAccountResetPasswordData: AdminVerifyAccountResetPasswordSchemaType) => {
    try {
        const response = await axios.put<AdminResponseDtoType>(API.AUTH.ADMIN.VERIFY_ACCOUNT_RESET_PASSWORD, { username, ...verifyAccountResetPasswordData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Account reset password verification failed");
    }
};

// Reset Password Axios
export const adminResetPassword = async (email: string, resetPasswordData: AdminResetPasswordSchemaType) => {
    try {
        const response = await axios.put<AdminResponseDtoType>(API.AUTH.ADMIN.RESET_PASSWORD, { email, ...resetPasswordData });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Password reset failed");
    }
};