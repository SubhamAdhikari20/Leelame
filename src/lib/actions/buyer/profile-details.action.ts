// src/lib/actions/buyer/profile-details.action.ts
"use server";
import { getCurrentBuyerUser, updateBuyerProfileDetails, deleteBuyerAccount, uploadBuyerProfilePicture, getBuyerById } from "@/lib/api/buyer/profile-details.api.ts";
import { UpdateProfileDetailsSchemaType } from "@/schemas/buyer/update-profile-details.schema.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


// Get Current Buyer User Handler
export const handleGetCurrentBuyerUser = async (userId: string) => {
    try {
        const result = await getCurrentBuyerUser(userId);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to fetch buyer user!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Buyer user fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during buyer user fetching."
        };
    }
};

// Update Profile Details Handler
export const handleUpdateBuyerProfileDetails = async (userId: string, buyerProfileData: UpdateProfileDetailsSchemaType) => {
    try {
        const result = await updateBuyerProfileDetails(userId, buyerProfileData);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to update buyer profile details!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Buyer profile details updated successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during buyer profile update."
        };
    }
};

// Upload Buyer Profile Picture Handler
export const handleUploadBuyerProfilePicture = async (userId: string, formData: FormData) => {
    try {
        const result = await uploadBuyerProfilePicture(userId, formData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to upload buyer profile picture!"
            };
        }

        const data = { ...result.data, imageUrl: normalizeHttpUrl(result.data.imageUrl) };

        return {
            success: true,
            message: result.message || "Buyer profile picture uploaded successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during buyer profile picture upload."
        };
    }
};

// Delete Buyer Account Handler
export const handleDeleteBuyerAccount = async (userId: string) => {
    try {
        const result = await deleteBuyerAccount(userId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete buyer account!"
            };
        }
        return {
            success: true,
            message: result.message || "Buyer account deleted successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during buyer account deletion."
        };
    }
};

// Get Buyer By ID Handler
export const handleGetBuyerById = async (buyerId: string) => {
    try {
        const result = await getBuyerById(buyerId);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to fetch buyer user!"
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