// src/lib/api/seller/profile-details.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import { SellerResponseDtoType } from "@/dtos/seller.dto.ts";
import { UpdateProfileDetailsSchemaType } from "@/schemas/seller/update-profile-details.schema.ts";


// Update Profile Details Axios
export const updateSellerProfileDetails = async (userId: string, sellerProfileData: UpdateProfileDetailsSchemaType) => {
    try {
        const response = await axios.put<SellerResponseDtoType>(`${API.AUTH.SELLER.UPDATE_PROFILE_DETAILS}/${userId}`, sellerProfileData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update seller profile details!");
    }
};

// Delete Seller Account Axios
export const deleteSellerAccount = async (userId: string) => {
    try {
        const response = await axios.delete<SellerResponseDtoType>(`${API.AUTH.SELLER.DELETE_ACCOUNT}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete seller account!");
    }
};

// Upload Seller Profile Picture Axios
export const uploadSellerProfilePicture = async (formData: FormData) => {
    try {
        const response = await axios.put<SellerResponseDtoType>(API.AUTH.SELLER.UPLOAD_PROFILE_PICTURE, formData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to upload seller profile picture!");
    }
};