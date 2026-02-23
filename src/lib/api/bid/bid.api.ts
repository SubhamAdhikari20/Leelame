// src/lib/api/bid/bid.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { BidApiResponseType, AllBidsApiResponseType } from "@/types/api-response.type.ts";
import type { CreateBidSchemaType } from "@/schemas/bid/create-bid.schema.ts";
import type { UpdateBidSchemaType } from "@/schemas/bid/update-bid.schema.ts";


// Create Bid Axios
export const createBid = async (createBidSchema: CreateBidSchemaType) => {
    try {
        const response = await axios.post<BidApiResponseType>(API.BID.CREATE_BID, createBidSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to create bid !");
    }
};

// Update Bid Details Axios
export const updateBid = async (bidId: string, updateBidSchema: UpdateBidSchemaType) => {
    try {
        const response = await axios.put<BidApiResponseType>(`${API.BID.UPDATE_BID}/${bidId}`, updateBidSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update bid details!");
    }
};

// Delete Bid Axios
export const deleteBid = async (bidId: string) => {
    try {
        const response = await axios.delete<BidApiResponseType>(`${API.BID.DELETE_BID}/${bidId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete bid!");
    }
};

// Get Bid By Id Axios
export const getBidById = async (bidId: string) => {
    try {
        const response = await axios.get<BidApiResponseType>(`${API.BID.GET_BID_BY_ID}/${bidId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch bid by id!");
    }
};

// Get All Bids Axios
export const getAllBids = async () => {
    try {
        const response = await axios.get<AllBidsApiResponseType>(API.BID.GET_ALL_BIDS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all bids!");
    }
};

// Get All Bids By Product Id Axios
export const getAllBidsByProductId = async (productId: string) => {
    try {
        const response = await axios.get<AllBidsApiResponseType>(`${API.BID.GET_ALL_BIDS}/${productId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all bids with this product id!");
    }
};

// Get All Bids By Buyer Id Axios
export const getAllBidsByBuyerId = async (buyerId: string) => {
    try {
        const response = await axios.get<AllBidsApiResponseType>(`${API.BID.GET_ALL_BIDS}/${buyerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all bids with this buyer id!");
    }
};

// Get All Bids By Seller Id Axios
export const getAllBidsBySellerId = async (sellerId: string) => {
    try {
        const response = await axios.get<AllBidsApiResponseType>(`${API.BID.GET_ALL_BIDS}/${sellerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all bids with this seller id!");
    }
};