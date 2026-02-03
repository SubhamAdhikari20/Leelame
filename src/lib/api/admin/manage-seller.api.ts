// src/lib/api/admin/manage-seller.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AllSellerApiResposeType, SellerApiResponseType } from "@/types/api-response.type.ts";
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
        // if (formData) {
        //     response = await axios.post<SellerApiResponseType>(API.AUTH.ADMIN.CREATE_SELLER_ACCOUNT, { ...createSellerAccountData, ...formData }, {
        //         headers: {
        //             "Content-Type": "multipart/form-data"
        //         },
        //     });
        //     return response.data;
        // }
        response = await axios.post<SellerApiResponseType>(API.AUTH.ADMIN.CREATE_SELLER_ACCOUNT, createSellerAccountData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        console.error(axiosError);
        throw new Error(axiosError.response?.data.message || "Failed to create seller account in admin workspace!");
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