// src/lib/api/admin/manage-seller.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AllSellerApiResposeType, SellerApiResponseType, UploadImageAdminApiResponseType } from "@/types/api-response.type.ts";
import type { CreateSellerAccountSchemaType, UpdateSellerAccountSchemaType } from "@/schemas/admin/manage-seller-account.schema.ts";


// Get All Sellers User By Admin Axios
export const getAllSellers = async () => {
    try {
        const response = await axios.get<AllSellerApiResposeType>(API.AUTH.ADMIN.GET_ALL_SELLERS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch sellers in admin workspace!");
    }
};

// Create Seller Account By Admin Up Axios
export const createSellerAccountByAdmin = async (createSellerAccountData: CreateSellerAccountSchemaType, formData?: FormData | null) => {
    try {
        let response;
        if (formData) {
            Object.entries(createSellerAccountData).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            response = await axios.post<SellerApiResponseType>(API.AUTH.ADMIN.CREATE_SELLER_ACCOUNT, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            return response.data;
        }
        response = await axios.post<SellerApiResponseType>(API.AUTH.ADMIN.CREATE_SELLER_ACCOUNT, createSellerAccountData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        console.error(axiosError);
        throw new Error(axiosError.response?.data.message || "Failed to create seller account in admin workspace!");
    }
};

// Get Seller By Id User By Admin Axios
export const getSellerById = async (sellerId: string) => {
    try {
        const response = await axios.get<SellerApiResponseType>(`${API.AUTH.ADMIN.GET_SELLER_BY_ID}/${sellerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch seller by id in admin workspace!");
    }
};

// Update Seller Profile Details By Admin Axios
export const updateSellerProfileDetailsByAdmin = async (sellerId: string, sellerProfileData: UpdateSellerAccountSchemaType) => {
    try {
        const response = await axios.put<SellerApiResponseType>(`${API.AUTH.ADMIN.UPDATE_SELLER_DETAILS}/${sellerId}`, sellerProfileData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update seller profile details in admin workspace!");
    }
};

// Upload Seller Profile Picture By Admin Axios
export const uploadSellerProfilePictureByAdmin = async (sellerId: string, formData: FormData) => {
    try {
        const response = await axios.put<UploadImageAdminApiResponseType>(`${API.AUTH.ADMIN.UPLOAD_SELLER_PROFILE_PICTURE}/${sellerId}`, formData, {
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


// Delete Seller Account By Admin Axios
export const deleteSellerAccountByAdmin = async (sellerId: string) => {
    try {
        const response = await axios.delete<SellerApiResponseType>(`${API.AUTH.ADMIN.DELETE_SELLER_ACCOUNT}/${sellerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete seller account in admin workspace!");
    }
};