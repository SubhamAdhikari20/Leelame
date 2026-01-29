// src/lib/api/buyer/profile-details.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { BuyerApiResponseType } from "@/types/api-response.type.ts";
import type { UpdateProfileDetailsSchemaType } from "@/schemas/buyer/update-profile-details.schema.ts";


// Get Current Buyer User Axios
export const getCurrentBuyerUser = async (userId: string) => {
    try {
        const response = await axios.get<BuyerApiResponseType>(`${API.AUTH.BUYER.GET_CURRENT_BUYER_USER}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch current buyer user!");
    }
}

// Update Profile Details Axios
export const updateBuyerProfileDetails = async (userId: string, buyerProfileData: UpdateProfileDetailsSchemaType) => {
    try {
        const response = await axios.put<BuyerApiResponseType>(`${API.AUTH.BUYER.UPDATE_PROFILE_DETAILS}/${userId}`, buyerProfileData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update buyer profile details!");
    }
};

// Upload Buyer Profile Picture Axios
export const uploadBuyerProfilePicture = async (userId: string, formData: FormData) => {
    try {
        const response = await axios.put<BuyerApiResponseType>(`${API.AUTH.BUYER.UPLOAD_PROFILE_PICTURE}/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to upload buyer profile picture!");
    }
};

// Delete Buyer Account Axios
export const deleteBuyerAccount = async (userId: string) => {
    try {
        const response = await axios.delete<BuyerApiResponseType>(`${API.AUTH.BUYER.DELETE_ACCOUNT}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete buyer account!");
    }
};