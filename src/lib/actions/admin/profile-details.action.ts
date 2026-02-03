// src/lib/actions/admin/profile-details.action.ts
"use server";
import { deleteAdminAccount, updateAdminProfileDetails, getCurrentAdminUser, adminLogout, uploadAdminProfilePicture } from "@/lib/api/admin/profile-details.api.ts";
import { clearAuthCookies } from "@/lib/cookie.ts";
import type { UpdateAdminProfileDetailsSchemaType } from "@/schemas/admin/update-profile-details.schema.ts";


// Get Current Admin User Handler
export const handleGetCurrentAdminUser = async (userId: string) => {
    try {
        const result = await getCurrentAdminUser(userId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch admin user!"
            };
        }
        return {
            success: true,
            message: result.message || "Admin user fetched successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during admin user fetching."
        };
    }
};

// Update Profile Details Handler
export const handleUpdateAdminProfileDetails = async (userId: string, adminProfileData: UpdateAdminProfileDetailsSchemaType) => {
    try {
        const result = await updateAdminProfileDetails(userId, adminProfileData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update admin profile details!"
            };
        }
        return {
            success: true,
            message: result.message || "Admin profile details updated successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during admin profile update."
        };
    }
};

// Upload Admin Profile Picture Handler
export const handleUploadAdminProfilePicture = async (userId: string, formData: FormData) => {
    try {
        const result = await uploadAdminProfilePicture(userId, formData);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to upload admin profile picture!"
            };
        }
        return {
            success: true,
            message: result.message || "Admin profile picture uploaded successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during admin profile picture upload."
        };
    }
};


// Delete Admin Account Handler
export const handleDeleteAdminAccount = async (userId: string) => {
    try {
        const result = await deleteAdminAccount(userId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete admin account!"
            };
        }
        return {
            success: true,
            message: result.message || "Admin account deleted successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during admin account deletion."
        };
    }
};

// Logout Handler
export const handleAdminLogout = async () => {
    try {
        const result = await adminLogout();
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to logout admin account!"
            };
        }

        await clearAuthCookies();
        return {
            success: true,
            message: "Authentication cookies deleted successfully."
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while logging out deleting authentication cookies."
        };
    }
};
