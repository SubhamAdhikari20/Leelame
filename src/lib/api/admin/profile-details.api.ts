// src/lib/api/admin/profile-details.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import { AdminApiResponseType } from "@/types/api-response.type.ts";
import { UpdateAdminProfileDetailsSchemaType } from "@/schemas/admin/update-profile-details.schema.ts";


// Get Current Admin User Axios
export const getCurrentAdminUser = async (userId: string) => {
    try {
        const response = await axios.get<AdminApiResponseType>(`${API.AUTH.ADMIN.GET_CURRENT_ADMIN_USER}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch current admin user!");
    }
}

// Update Profile Details Axios
export const updateAdminProfileDetails = async (userId: string, adminProfileData: UpdateAdminProfileDetailsSchemaType) => {
    try {
        const response = await axios.put<AdminApiResponseType>(`${API.AUTH.SELLER.UPDATE_PROFILE_DETAILS}/${userId}`, adminProfileData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update admin profile details!");
    }
};

// Delete Admin Account Axios
export const deleteAdminAccount = async (userId: string) => {
    try {
        const response = await axios.delete<AdminApiResponseType>(`${API.AUTH.SELLER.DELETE_ACCOUNT}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete admin account!");
    }
};

// Upload Admin Profile Picture Axios
export const uploadAdminProfilePicture = async (formData: FormData) => {
    try {
        const response = await axios.put<AdminApiResponseType>(API.AUTH.SELLER.UPLOAD_PROFILE_PICTURE, formData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to upload admin profile picture!");
    }
};

// Logout Axios
export const adminLogout = async () => {
    try {
        const response = await axios.get<AdminApiResponseType>(API.AUTH.ADMIN.LOGOUT);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Logout failed");
    }
};