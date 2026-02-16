// src/lib/api/endpoints.ts


export const API = {
    AUTH: {
        BUYER: {
            SIGN_UP: "/api/users/buyer/sign-up",
            LOGIN: "/api/users/buyer/login",
            CHECK_USERNAME_UNIQUE: "/api/users/buyer/check-username-unique",
            GOOGLE_LOGIN: "/api/users/buyer/login-with-google",
            SEND_ACCOUNT_REGISTRATION_EMAIL: "/api/users/buyer/send-account-registration-email",
            VERIFY_ACCOUNT_REGISTRATION: "/api/users/buyer/verify-account/registration",
            FORGOT_PASSWORD: "/api/users/buyer/forgot-password",
            VERIFY_ACCOUNT_RESET_PASSWORD: "/api/users/buyer/verify-account/reset-password",
            RESET_PASSWORD: "/api/users/buyer/reset-password",
            GET_CURRENT_BUYER_USER: "/api/users/buyer",
            UPDATE_PROFILE_DETAILS: "/api/users/buyer/update-profile-details",
            DELETE_ACCOUNT: "/api/users/buyer/delete-account",
            UPLOAD_PROFILE_PICTURE: "/api/users/buyer/upload-profile-picture"
        },
        SELLER: {
            SIGN_UP: "/api/users/seller/sign-up",
            LOGIN: "/api/users/seller/login",
            SEND_ACCOUNT_REGISTRATION_EMAIL: "/api/users/seller/send-account-registration-email",
            VERIFY_ACCOUNT_REGISTRATION: "/api/users/seller/verify-account-registration",
            FORGOT_PASSWORD: "/api/users/seller/forgot-password",
            RESET_PASSWORD: "/api/users/seller/reset-password",
            GET_CURRENT_SELLER_USER: "/api/users/seller",
            UPDATE_PROFILE_DETAILS: "/api/users/seller/update-profile-details",
            DELETE_ACCOUNT: "/api/users/seller/delete-account",
            UPLOAD_PROFILE_PICTURE: "/api/users/seller/upload-profile-picture"
        },
        ADMIN: {
            SIGN_UP: "/api/users/admin/sign-up",
            LOGIN: "/api/users/admin/login",
            SEND_ACCOUNT_REGISTRATION_EMAIL: "/api/users/admin/send-account-registration-email",
            VERIFY_ACCOUNT_REGISTRATION: "/api/users/admin/verify-account-registration",
            FORGOT_PASSWORD: "/api/users/admin/forgot-password",
            VERIFY_ACCOUNT_RESET_PASSWORD: "/api/users/admin/verify-account-reset-password",
            RESET_PASSWORD: "/api/users/admin/reset-password",
            LOGOUT: "/api/users/admin/logout",
            GET_CURRENT_ADMIN_USER: "/api/users/admin",
            UPDATE_PROFILE_DETAILS: "/api/users/admin/update-profile-details",
            DELETE_ACCOUNT: "/api/users/admin/delete-account",
            UPLOAD_PROFILE_PICTURE: "/api/users/admin/upload-profile-picture",
            GET_ALL_SELLERS: "/api/users/admin/get-all-sellers",
            GET_SELLER_BY_ID: "/api/users/admin/get-seller-by-id",
            CREATE_SELLER_ACCOUNT: "/api/users/admin/create-seller-account",
            UPDATE_SELLER_DETAILS: "/api/users/admin/update-seller-details",
            UPLOAD_SELLER_PROFILE_PICTURE: "/api/users/admin/upload-seller-profile-picture",
            DELETE_SELLER_ACCOUNT: "/api/users/admin/delete-seller-account",
        }
    },
    CATEGORY: {
        CREATE_CATEGORY: "/api/category/create-category",
        UPDATE_CATEGORY: "/api/category/update-category-details",
        DELETE_CATEGORY: "/api/category/delete-category",
        GET_ALL_CATEGORIES: "/api/category/get-all-categories",
        GET_CATEGORY_BY_ID: "/api/category",
    }
};