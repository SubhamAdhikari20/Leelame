// src/lib/api/seller/profile-details.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AllSellerApiResposeType, SellerApiResponseType, UploadImageSellerApiResponseType } from "@/types/api-response.type.ts";
import type { UpdateProfileDetailsSchemaType } from "@/schemas/seller/update-profile-details.schema.ts";


// Get Current Seller User Axios
export const getCurrentSellerUser = async (userId: string) => {
    try {
        const response = await axios.get<SellerApiResponseType>(`${API.AUTH.SELLER.GET_CURRENT_SELLER_USER}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch current seller user!");
    }
}

// Update Profile Details Axios
export const updateSellerProfileDetails = async (userId: string, sellerProfileData: UpdateProfileDetailsSchemaType) => {
    try {
        const response = await axios.put<SellerApiResponseType>(`${API.AUTH.SELLER.UPDATE_PROFILE_DETAILS}/${userId}`, sellerProfileData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update seller profile details!");
    }
};

// Upload Seller Profile Picture Axios
export const uploadSellerProfilePicture = async (userId: string, formData: FormData) => {
    try {
        const response = await axios.put<UploadImageSellerApiResponseType>(`${API.AUTH.SELLER.UPLOAD_PROFILE_PICTURE}/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to upload seller profile picture!");
    }
};

// Delete Seller Account Axios
export const deleteSellerAccount = async (userId: string) => {
    try {
        const response = await axios.delete<SellerApiResponseType>(`${API.AUTH.SELLER.DELETE_ACCOUNT}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete seller account!");
    }
};

// Get All Sellers Axios
export const getAllSellers = async () => {
    try {
        const response = await axios.get<AllSellerApiResposeType>(API.AUTH.SELLER.GET_ALL_SELLERS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch sellers!");
    }
};