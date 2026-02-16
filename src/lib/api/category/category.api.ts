// src/lib/api/category/category.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { CategoryApiResponseType, AllCategoriesApiResponseType } from "@/types/api-response.type.ts";
import type { CreateCategorySchemaType } from "@/schemas/category/create-category.schema.ts";
import type { UpdateCategorySchemaType } from "@/schemas/category/update-category.schema.ts";


// Create Category Axios
export const createCategory = async (createCategorySchema: CreateCategorySchemaType) => {
    try {
        const response = await axios.post<CategoryApiResponseType>(API.CATEGORY.CREATE_CATEGORY, createCategorySchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to create category details!");
    }
};

// Update Category Details Axios
export const updateCategory = async (categoryId: string, updateCategorySchema: UpdateCategorySchemaType) => {
    try {
        const response = await axios.put<CategoryApiResponseType>(`${API.CATEGORY.UPDATE_CATEGORY}/${categoryId}`, updateCategorySchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update category details!");
    }
};

// Delete Category Axios
export const deleteCategory = async (categoryId: string) => {
    try {
        const response = await axios.delete<CategoryApiResponseType>(`${API.CATEGORY.DELETE_CATEGORY}/${categoryId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete category!");
    }
};

// Get Category By Id Axios
export const getCategoryById = async (categoryId: string) => {
    try {
        const response = await axios.get<CategoryApiResponseType>(`${API.CATEGORY.GET_CATEGORY_BY_ID}/${categoryId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch category by id!");
    }
};

// Get All Categories Axios
export const getAllCategories = async () => {
    try {
        const response = await axios.get<AllCategoriesApiResponseType>(API.CATEGORY.GET_ALL_CATEGORIES);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all categories!");
    }
};