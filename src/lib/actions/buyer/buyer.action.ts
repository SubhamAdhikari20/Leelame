// src/lib/actions/buyer/buyer.action.ts
"use server";
import { getAllBuyers } from "@/lib/api/buyer/buyer.api.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


// Get All Buyers Handler
export const handleGetAllBuyers = async () => {
    try {
        const result = await getAllBuyers();
        if (!result.success || !result.users) {
            return {
                success: false,
                message: result.message || "Failed to fetch buyers!"
            };
        }

        const data = result.users.map(user => ({ ...user, profilePictureUrl: normalizeHttpUrl(user.profilePictureUrl) }));

        return {
            success: true,
            message: result.message || "Buyers fetched successfully.",
            data: data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred during buyers fetching."
        };
    }
};