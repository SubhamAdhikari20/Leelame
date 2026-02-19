// src/lib/actions/category/category.action.ts
"use server";
import { createCategory, updateCategory, deleteCategory, getCategoryById, getAllCategories } from "@/lib/api/category/category.api.ts";
import type { CreateCategorySchemaType } from "@/schemas/category/create-category.schema.ts";
import type { UpdateCategorySchemaType } from "@/schemas/category/update-category.schema.ts";


// Create Category Handler
export const handleCreateCategory = async (createCategorySchema: CreateCategorySchemaType) => {
    try {
        const result = await createCategory(createCategorySchema);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to create category!"
            };
        }
        return {
            success: true,
            message: result.message || "Category created successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while creating category!"
        };
    }
};

// Update Category Details Handler
export const handleUpdateCategory = async (categoryId: string, updateCategorySchema: UpdateCategorySchemaType) => {
    try {
        const result = await updateCategory(categoryId, updateCategorySchema);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update category!"
            };
        }
        return {
            success: true,
            message: result.message || "Category updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating category!"
        };
    }
};

// Delete Category Handler
export const handleDeleteCategory = async (categoryId: string) => {
    try {
        const result = await deleteCategory(categoryId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete category!"
            };
        }
        return {
            success: true,
            message: result.message || "Category deleted successfully.",
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting category!"
        };
    }
};

// Get Category By Id Handler
export const handleGetCategoryById = async (categoryId: string) => {
    try {
        const result = await getCategoryById(categoryId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch category by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Category fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching category!"
        };
    }
};

// Get All Categories Handler
export const handleGetAllCategories = async () => {
    try {
        const result = await getAllCategories();
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the categories!",
            };
        }
        return {
            success: true,
            message: result.message || "All categories fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all categories!",
        };
    }
};