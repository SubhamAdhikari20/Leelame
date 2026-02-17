// src/lib/actions/product/product.action.ts
"use server";
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts } from "@/lib/api/product/product.api.ts";
import type { CreateProductSchemaType } from "@/schemas/product/create-product.schema.ts";
import type { UpdateProductSchemaType } from "@/schemas/product/update-product.schema.ts";


// Create Product Handler
export const handleCreateProduct = async (createProductSchema: CreateProductSchemaType, productImagesFromData?: FormData | null) => {
    try {
        const result = await createProduct(createProductSchema, productImagesFromData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to create product."
            };
        }
        return {
            success: true,
            message: result.message || "Product created successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while creating product."
        };
    }
};

// Update Product Details Handler
export const handleUpdateProduct = async (productId: string, updateProductSchema: UpdateProductSchemaType, productImagesFromData?: FormData | null) => {
    try {
        const result = await updateProduct(productId, updateProductSchema, productImagesFromData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update product."
            };
        }
        return {
            success: true,
            message: result.message || "Product updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating product."
        };
    }
};

// Delete Product Handler
export const handleDeleteProduct = async (productId: string) => {
    try {
        const result = await deleteProduct(productId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete product."
            };
        }
        return {
            success: true,
            message: result.message || "Product deleted successfully.",
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting product."
        };
    }
};

// Get Product By Id Handler
export const handleGetProductById = async (productId: string) => {
    try {
        const result = await getProductById(productId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch product by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Product fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching product."
        };
    }
};

// Get All Products Handler
export const handleGetAllProducts = async () => {
    try {
        const result = await getAllProducts();
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the products!",
            };
        }
        return {
            success: true,
            message: result.message || "All products fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all products!",
        };
    }
};