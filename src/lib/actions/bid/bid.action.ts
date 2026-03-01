// src/lib/actions/bid/bid.action.ts
"use server";
import { createBid, updateBid, deleteBid, getBidById, getAllBids, getAllBidsByProductId, getAllBidsByBuyerId, getAllBidsBySellerId } from "@/lib/api/bid/bid.api.ts";
import type { CreateBidSchemaType } from "@/schemas/bid/create-bid.schema.ts";
import type { UpdateBidSchemaType } from "@/schemas/bid/update-bid.schema.ts";


// Create Bid Handler
export const handleCreateBid = async (createBidSchema: CreateBidSchemaType) => {
    try {
        const result = await createBid(createBidSchema);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to create bid!"
            };
        }
        return {
            success: true,
            message: result.message || "Bid created successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while creating bid!"
        };
    }
};

// Update Bid Details Handler
export const handleUpdateBid = async (bidId: string, updateBidSchema: UpdateBidSchemaType) => {
    try {
        const result = await updateBid(bidId, updateBidSchema);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to update bid!"
            };
        }
        return {
            success: true,
            message: result.message || "Bid updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating bid!"
        };
    }
};

// Delete Bid Handler
export const handleDeleteBid = async (bidId: string) => {
    try {
        const result = await deleteBid(bidId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete bid!"
            };
        }
        return {
            success: true,
            message: result.message || "Bid deleted successfully.",
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting bid!"
        };
    }
};

// Get Bid By Id Handler
export const handleGetBidById = async (bidId: string) => {
    try {
        const result = await getBidById(bidId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch bid by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Bid fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching bid!"
        };
    }
};

// Get All Bids Handler
export const handleGetAllBids = async () => {
    try {
        const result = await getAllBids();
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the bids!",
            };
        }
        return {
            success: true,
            message: result.message || "All bids fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all bids!",
        };
    }
};

// Get All Bids By Product Id Handler
export const handleGetAllBidsByProductId = async (productId: string) => {
    try {
        const result = await getAllBidsByProductId(productId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the bids with this product id!",
            };
        }
        return {
            success: true,
            message: result.message || "All bids with this product id fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all bids with this product id!",
        };
    }
};

// Get All Bids By Buyer Id Handler
export const handleGetAllBidsByBuyerId = async (buyerId: string) => {
    try {
        const result = await getAllBidsByBuyerId(buyerId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the bids with this buyer id!",
            };
        }
        return {
            success: true,
            message: result.message || "All bids with this buyer id fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all bids with this buyer id!",
        };
    }
};

// Get All Bids By Seller Id Handler
export const handleGetAllBidsBySellerId = async (sellerId: string) => {
    try {
        const result = await getAllBidsBySellerId(sellerId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the bids with this seller id!",
            };
        }
        return {
            success: true,
            message: result.message || "All bids with this seller id fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all bids with this seller id!",
        };
    }
};