// src/lib/actions/admin/manage-seller.action.ts
"use server";
import { createSellerAccountByAdmin, deleteSellerAccountByAdmin, getAllSellers, getSellerById, updateSellerProfileDetailsByAdmin, uploadSellerProfilePictureByAdmin } from "@/lib/api/admin/manage-seller.api.ts";
import type { CreateSellerAccountSchemaType, UpdateSellerAccountSchemaType } from "@/schemas/admin/manage-seller-account.schema.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


// Get All Sellers User By Admin Handler
export const handleGetAllSellers = async () => {
    try {
        const result = await getAllSellers();
        if (!result.success || !result.users) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the sellers in admin workspace!",
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
            message: error.message || "An unexpected error occurred while fetching all sellers in admin workspace!",
        };
    }
};

// Create Seller Account By Admin Up Handler
export const handleCreateSellerAccountByAdmin = async (createSellerAccountData: CreateSellerAccountSchemaType, formData?: FormData | null) => {
    try {
        const result = await createSellerAccountByAdmin(createSellerAccountData, formData);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to create seller account by admin!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Seller created by admin successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller account creation by admin!"
        };
    }
};

// Get Seller By Id User By Admin Handler
export const handleGetSellerById = async (sellerId: string) => {
    try {
        const result = await getSellerById(sellerId);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to fetch the seller in admin workspace!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Seller fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching the seller in admin workspace!"
        };
    }
};

// Update Seller Profile Details By Admin Handler
export const handleUpdateSellerProfileDetailsByAdmin = async (sellerId: string, sellerProfileData: UpdateSellerAccountSchemaType) => {
    try {
        const result = await updateSellerProfileDetailsByAdmin(sellerId, sellerProfileData);
        if (!result.success || !result.user) {
            return {
                success: false,
                message: result.message || "Failed to update seller profile details by admin!"
            };
        }

        const data = { ...result.user, profilePictureUrl: normalizeHttpUrl(result.user.profilePictureUrl) };

        return {
            success: true,
            message: result.message || "Seller profile details updated by admin successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during seller profile update by admin!"
        };
    }
};

// Upload Seller Profile Picture By Admin Handler
export const handleUploadSellerProfilePictureByAdmin = async (sellerId: string, formData: FormData) => {
    try {
        const result = await uploadSellerProfilePictureByAdmin(sellerId, formData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to upload seller profile picture by admin!"
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

// Delete Seller Account By Admin Handler
export const handleDeleteSellerAccountByAdmin = async (sellerId: string) => {
    try {
        const result = await deleteSellerAccountByAdmin(sellerId);
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