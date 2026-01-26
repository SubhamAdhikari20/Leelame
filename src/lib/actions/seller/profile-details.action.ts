// src/lib/actions/seller/profile-details.action.ts
"use server";
import { deleteSellerAccount, updateSellerProfileDetails } from "@/lib/api/seller/profile-details.api.ts";
import { UpdateProfileDetailsSchemaType } from "@/schemas/seller/update-profile-details.schema.ts";


// Update Profile Details Handler
export const handleSellerProfileDetails = async (userId: string, sellerProfileData: UpdateProfileDetailsSchemaType) => {
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