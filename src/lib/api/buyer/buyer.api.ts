// src/lib/api/buyer/buyer.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AllBuyersApiResponseType } from "@/types/api-response.type.ts";


// Get All Buyers Axios
export const getAllBuyers = async () => {
    try {
        const response = await axios.get<AllBuyersApiResponseType>(API.AUTH.BUYER.GET_ALL_BUYERS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch buyers!");
    }
};