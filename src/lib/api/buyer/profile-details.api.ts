// src/lib/api/buyer/profile-details.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import { BuyerResponseDtoType } from "@/dtos/buyer.dto.ts";


// Get Current Buyer User Axios
export const getCurrentBuyerUser = async (userId: string) => {
    try {
        const response = await axios.get<BuyerResponseDtoType>(`${API.AUTH.BUYER.GET_CURRENT_BUYER_USER}/${userId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch current buyer user!");
    }
}