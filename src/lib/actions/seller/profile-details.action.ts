// src/lib/actions/seller/profile-details.action.ts
"use server";
import { deleteSellerAccount, updateSellerProfileDetails, getCurrentSellerUser } from "@/lib/api/seller/profile-details.api.ts";
import type { UpdateProfileDetailsSchemaType } from "@/schemas/seller/update-profile-details.schema.ts";


// Get Current Seller User Handler
export const handleGetCurrentSellerUser = async (userId: string) => {
    try {
        const result = await getCurrentSellerUser(userId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch seller user!"
            };
        }
        return {
            success: true,
            message: result.message || "Seller user fetched successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller user fetching."
        };
    }
};

// Update Profile Details Handler
export const handleUpdateSellerProfileDetails = async (userId: string, sellerProfileData: UpdateProfileDetailsSchemaType) => {
    try {
        const result = await updateSellerProfileDetails(userId, sellerProfileData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update seller profile details!"
            };
        }
        return {
            success: true,
            message: result.message || "Seller profile details updated successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller profile update."
        };
    }
};

// Delete Seller Account Handler
export const handleDeleteSellerAccount = async (userId: string) => {
    try {
        const result = await deleteSellerAccount(userId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete seller account!"
            };
        }
        return {
            success: true,
            message: result.message || "Seller account deleted successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller account deletion."
        };
    }
};