// src/lib/actions/product-condition/condition.action.ts
"use server";
import { createProductCondition, updateProductCondition, deleteProductCondition, getProductConditionById, getAllProductConditions } from "@/lib/api/product-condition/condition.api.ts";
import type { CreateProductConditionSchemaType } from "@/schemas/product-condition/create-condition.schema.ts";
import type { UpdateProductConditionSchemaType } from "@/schemas/product-condition/update-condition.schema.ts";


// Create Product Condition Handler
export const handleCreateProductCondition = async (createProductConditionSchema: CreateProductConditionSchemaType) => {
    try {
        const result = await createProductCondition(createProductConditionSchema);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to create product condition!"
            };
        }
        return {
            success: true,
            message: result.message || "Product condition created successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while creating product condition!"
        };
    }
};

// Update Product Condition Details Handler
export const handleUpdateProductCondition = async (productConditionId: string, updateProductConditionSchema: UpdateProductConditionSchemaType) => {
    try {
        const result = await updateProductCondition(productConditionId, updateProductConditionSchema);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update product condition!"
            };
        }
        return {
            success: true,
            message: result.message || "Product condition updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating product condition!"
        };
    }
};

// Delete Product Condition Handler
export const handleDeleteProductCondition = async (productConditionId: string) => {
    try {
        const result = await deleteProductCondition(productConditionId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete product condition!"
            };
        }
        return {
            success: true,
            message: result.message || "Product condition deleted successfully.",
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting product condition!"
        };
    }
};

// Get Product Condition By Id Handler
export const handleGetProductConditionById = async (productConditionId: string) => {
    try {
        const result = await getProductConditionById(productConditionId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch productCondition by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Product condition fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching product condition!"
        };
    }
};

// Get All Product Conditions Handler
export const handleGetAllProductConditions = async () => {
    try {
        const result = await getAllProductConditions();
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the product conditions!",
            };
        }
        return {
            success: true,
            message: result.message || "All product conditions fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all product conditions!",
        };
    }
};