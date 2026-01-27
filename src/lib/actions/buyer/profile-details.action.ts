// src/lib/actions/buyer/profile-details.action.ts
"use server";
import { getCurrentBuyerUser } from "@/lib/api/buyer/profile-details.api.ts";


// Get Current Buyer User Handler
export const handleGetCurrentBuyerUser = async (userId: string) => {
    try {
        const result = await getCurrentBuyerUser(userId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch buyer user!"
            };
        }
        return {
            success: true,
            message: result.message || "Buyer user fetched successfully.",
            data: result.user
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during buyer user fetching."
        };
    }
};