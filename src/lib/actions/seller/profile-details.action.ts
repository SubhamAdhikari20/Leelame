// src/lib/actions/seller/profile-details.action.ts
"use server";
import { deleteSellerAccount, updateSellerProfileDetails, getCurrentSellerUser, uploadSellerProfilePicture, getAllSellers, getSellerById } from "@/lib/api/seller/profile-details.api.ts";
import type { UpdateProfileDetailsSchemaType } from "@/schemas/seller/update-profile-details.schema.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


// Get Current Seller User Handler
export const handleGetCurrentSellerUser = async (userId: string) => {
    try {
        const result = await getCurrentSellerUser(userId);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to fetch seller user!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Seller user fetched successfully.",
            data: data
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
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to update seller profile details!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Seller profile details updated successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller profile update."
        };
    }
};

// Upload Seller Profile Picture Handler
export const handleUploadSellerProfilePicture = async (userId: string, formData: FormData) => {
    try {
        const result = await uploadSellerProfilePicture(userId, formData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to upload seller profile picture!"
            };
        }

        const data = { ...result.data, imageUrl: normalizeHttpUrl(result.data.imageUrl) };

        return {
            success: true,
            message: result.message || "Seller profile picture uploaded successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller profile picture upload."
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

// Get Seller By ID Handler
export const handleGetSellerById = async (sellerId: string) => {
    try {
        const result = await getSellerById(sellerId);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to fetch seller user!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Seller user fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller user fetching."
        };
    }
};

// Get All Sellers Handler
export const handleGetAllSellers = async () => {
    try {
        const result = await getAllSellers();
        if (!result.success || !result.users) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the sellers!",
            };
        }

        const data = result.users.map((user) => ({
            ...user,
            profilePictureUrl: normalizeHttpUrl(user.profilePictureUrl)
        }));

        return {
            success: true,
            message: result.message || "All selles fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all sellers!",
        };
    }
};