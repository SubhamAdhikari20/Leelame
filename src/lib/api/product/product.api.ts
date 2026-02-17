// src/lib/api/product/product.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { ProductApiResponseType, AllProductsApiResponseType } from "@/types/api-response.type.ts";
import type { CreateProductSchemaType } from "@/schemas/product/create-product.schema.ts";
import type { UpdateProductSchemaType } from "@/schemas/product/update-product.schema.ts";


// Create Product Axios
export const createProduct = async (createProductSchema: CreateProductSchemaType, productImagesFromData?: FormData | null) => {
    try {
        let response;
        if (productImagesFromData) {
            Object.entries(createProductSchema).forEach(([key, value]) => {
                productImagesFromData.append(key, value as string);
            });
            response = await axios.post<ProductApiResponseType>(API.PRODUCT.CREATE_PRODUCT, productImagesFromData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            return response.data;
        }
        response = await axios.post<ProductApiResponseType>(API.PRODUCT.CREATE_PRODUCT, createProductSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to create product details!");
    }
};

// Update Product Details Axios
export const updateProduct = async (productId: string, updateProductSchema: UpdateProductSchemaType, productImagesFromData?: FormData | null) => {
    try {
        let response;
        if (productImagesFromData) {
            Object.entries(updateProductSchema).forEach(([key, value]) => {
                productImagesFromData.append(key, value as string);
            });
            response = await axios.put<ProductApiResponseType>(`${API.PRODUCT.UPDATE_PRODUCT}/${productId}`, productImagesFromData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            return response.data;
        }
        response = await axios.put<ProductApiResponseType>(`${API.PRODUCT.UPDATE_PRODUCT}/${productId}`, updateProductSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update product details!");
    }
};

// Delete Product Axios
export const deleteProduct = async (productId: string) => {
    try {
        const response = await axios.delete<ProductApiResponseType>(`${API.PRODUCT.DELETE_PRODUCT}/${productId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete product!");
    }
};

// Get Product By Id Axios
export const getProductById = async (productId: string) => {
    try {
        const response = await axios.get<ProductApiResponseType>(`${API.PRODUCT.GET_PRODUCT_BY_ID}/${productId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch product by id!");
    }
};

// Get All Products Axios
export const getAllProducts = async () => {
    try {
        const response = await axios.get<AllProductsApiResponseType>(API.PRODUCT.GET_ALL_PRODUCTS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all products!");
    }
};