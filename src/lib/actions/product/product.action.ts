// src/lib/actions/product/product.action.ts
"use server";
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts, getAllProductsBySellerId, getAllProductsByBuyerId, getAllVerifiedProducts, verifyProductByAdmin } from "@/lib/api/product/product.api.ts";
import type { CreateProductSchemaType } from "@/schemas/product/create-product.schema.ts";
import type { UpdateProductSchemaType } from "@/schemas/product/update-product.schema.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


// Create Product Handler
export const handleCreateProduct = async (createProductSchema: CreateProductSchemaType, productImagesFromData?: FormData | null) => {
    try {
        const result = await createProduct(createProductSchema, productImagesFromData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to create product."
            };
        }

        const data = { ...result.data, productImageUrls: result.data.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null) };

        return {
            success: true,
            message: result.message || "Product created successfully.",
            data: data
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
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to update product."
            };
        }

        const data = { ...result.data, productImageUrls: result.data.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null) };

        return {
            success: true,
            message: result.message || "Product updated successfully.",
            data: data
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
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch product by id!"
            };
        }

        const data = { ...result.data, productImageUrls: result.data.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null) };

        return {
            success: true,
            message: result.message || "Product fetched successfully.",
            data: data
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
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the products!",
            };
        }

        const data = result.data.map((product) => ({
            ...product,
            productImageUrls: product.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null),
        }));

        return {
            success: true,
            message: result.message || "All products fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all products!",
        };
    }
};

// Get All Verified Products Handler
export const handleGetAllVerifiedProducts = async () => {
    try {
        const result = await getAllVerifiedProducts();
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the verified products!",
            };
        }

        const data = result.data.map((product) => ({
            ...product,
            productImageUrls: product.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null),
        }));

        return {
            success: true,
            message: result.message || "All verified products fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all verified products!",
        };
    }
};

// Get All Products By Seller Id Handler
export const handleGetAllProductsBySellerId = async (sellerId: string) => {
    try {
        const result = await getAllProductsBySellerId(sellerId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the products with this seller id!",
            };
        }

        const data = result.data.map((product) => ({
            ...product,
            productImageUrls: product.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null),
        }));

        return {
            success: true,
            message: result.message || "All products with this seller id fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all products with this seller id!",
        };
    }
};

// Get All Products By Buyer Id Handler
export const handleGetAllProductsByBuyerId = async (buyerId: string) => {
    try {
        const result = await getAllProductsByBuyerId(buyerId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the products with this buyer id!",
            };
        }

        const data = result.data.map((product) => ({
            ...product,
            productImageUrls: product.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null),
        }));

        return {
            success: true,
            message: result.message || "All products with this buyer id fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all products with this buyer id!",
        };
    }
};

// Verify Product By Admin Handler
export const handleVerifyProductByAdmin = async (productId: string, isVerified: boolean) => {
    try {
        const result = await verifyProductByAdmin(productId, isVerified);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to verify product by admin."
            };
        }

        const data = { ...result.data, productImageUrls: result.data.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url): url is string => url !== null) };

        return {
            success: true,
            message: result.message || "Product verification by admin successful.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while verifying product by admin."
        };
    }
};