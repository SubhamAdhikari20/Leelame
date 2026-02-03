// src/lib/actions/admin/manage-seller.action.ts
"use server";
import { createSellerAccountByAdmin, deleteSellerAccountByAdmin, getAllSellers, updateSellerProfileDetailsByAdmin } from "@/lib/api/admin/manage-seller.api.ts";
import type { CreateSellerAccountSchemaType, UpdateSellerAccountSchemaType } from "@/schemas/admin/manage-seller-account.schema.ts";


// Get All Sellers User By Admin Handler
export const handleGetAllSellers = async () => {
    try {
        const result = await getAllSellers();
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the sellers in admin workspace!",
            };
        }
        return {
            success: true,
            message: result.message || "All selles fetched successfully.",
            data: result.users
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all sellers in admin workspace!",
        };
    }
};

// Create Seller Account By Admin Up Handler
export const handleCreateSellerAccountByAdmin = async (createSellerAccountData: CreateSellerAccountSchemaType, formData?: FormData | null) => {
    try {
        const result = await createSellerAccountByAdmin(createSellerAccountData, formData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to create seller account by admin!"
            };
        }
        return {
            success: true,
            message: result.message || "Seller created by admin successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller account creation by admin!"
        };
    }
};

// Update Seller Profile Details By Admin Handler
export const handleUpdateSellerProfileDetailsByAdmin = async (sellerId: string, sellerProfileData: UpdateSellerAccountSchemaType) => {
    try {
        const result = await updateSellerProfileDetailsByAdmin(sellerId, sellerProfileData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update seller profile details by admin!"
            };
        }
        return {
            success: true,
            message: result.message || "Seller profile details updated by admin successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller profile update by admin!"
        };
    }
};

// Delete Seller Account By Admin Handler
export const handleDeleteSellerAccountByAdmin = async (seller: string) => {
    try {
        const result = await deleteSellerAccountByAdmin(seller);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete seller account by admin!"
            };
        }
        return {
            success: true,
            message: result.message || "Seller account deleted by admin successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller account deletion by admin!"
        };
    }
};