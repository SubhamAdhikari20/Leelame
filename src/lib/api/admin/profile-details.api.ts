// src/lib/api/admin/profile-details.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AdminApiResponseType, UploadImageAdminApiResponseType } from "@/types/api-response.type.ts";
import type { UpdateAdminProfileDetailsSchemaType } from "@/schemas/admin/update-profile-details.schema.ts";


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
};

// Update Profile Details Axios
export const updateAdminProfileDetails = async (userId: string, adminProfileData: UpdateAdminProfileDetailsSchemaType) => {
    try {
        const response = await axios.put<AdminApiResponseType>(`${API.AUTH.ADMIN.UPDATE_PROFILE_DETAILS}/${userId}`, adminProfileData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update admin profile details!");
    }
};

// Upload Admin Profile Picture Axios
export const uploadAdminProfilePicture = async (userId: string, formData: FormData) => {
    try {
        const response = await axios.put<UploadImageAdminApiResponseType>(`${API.AUTH.ADMIN.UPLOAD_PROFILE_PICTURE}/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to upload admin profile picture!");
    }
};

// Delete Admin Account Axios
export const deleteAdminAccount = async (userId: string) => {
    try {
        const response = await axios.delete<AdminApiResponseType>(`${API.AUTH.ADMIN.DELETE_ACCOUNT}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete admin account!");
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