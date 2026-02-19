// src/lib/api/product-condition/condition.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { ProductConditionApiResponseType, AllProductConditionsApiResponseType } from "@/types/api-response.type.ts";
import type { CreateProductConditionSchemaType } from "@/schemas/product-condition/create-condition.schema.ts";
import type { UpdateProductConditionSchemaType } from "@/schemas/product-condition/update-condition.schema.ts";


// Create Product Condition Axios
export const createProductCondition = async (createProductConditionSchema: CreateProductConditionSchemaType) => {
    try {
        const response = await axios.post<ProductConditionApiResponseType>(API.PRODUCT_CONDITION.CREATE_PRODUCT_CONDITION, createProductConditionSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to create product condition details!");
    }
};

// Update Product Condition Details Axios
export const updateProductCondition = async (productConditionId: string, updateProductConditionSchema: UpdateProductConditionSchemaType) => {
    try {
        const response = await axios.put<ProductConditionApiResponseType>(`${API.PRODUCT_CONDITION.UPDATE_PRODUCT_CONDITION}/${productConditionId}`, updateProductConditionSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update product condition details!");
    }
};

// Delete Product Condition Axios
export const deleteProductCondition = async (productConditionId: string) => {
    try {
        const response = await axios.delete<ProductConditionApiResponseType>(`${API.PRODUCT_CONDITION.DELETE_PRODUCT_CONDITION}/${productConditionId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete product condition!");
    }
};

// Get Product Condition By Id Axios
export const getProductConditionById = async (productConditionId: string) => {
    try {
        const response = await axios.get<ProductConditionApiResponseType>(`${API.PRODUCT_CONDITION.GET_PRODUCT_CONDITION_BY_ID}/${productConditionId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch product condition by id!");
    }
};

// Get All Product Conditions Axios
export const getAllProductConditions = async () => {
    try {
        const response = await axios.get<AllProductConditionsApiResponseType>(API.PRODUCT_CONDITION.GET_ALL_PRODUCT_CONDITIONS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all product conditions!");
    }
};