// src/lib/api/endpoints.ts

export const API = {
    AUTH: {
        BUYER: {
            SIGN_UP: "/api/users/buyer/sign-up",
            // LOGIN: "/api/users/buyer/login",
            CHECK_USERNAME_UNIQUE: "/api/users/buyer/check-username-unique",
            GOOGLE_LOGIN: "/api/users/buyer/login-with-google",
            SEND_ACCOUNT_REGISTRATION_EMAIL: "/api/users/buyer/send-account-registration-email",
            VERIFY_ACCOUNT_REGISTRATION: "/api/users/buyer/verify-account/registration",
            FORGOT_PASSWORD: "/api/users/buyer/forgot-password",
            VERIFY_ACCOUNT_RESET_PASSWORD: "/api/users/buyer/verify-account/reset-password",
            RESET_PASSWORD: "/api/users/buyer/reset-password"
        }
    }
};