// src/lib/api/payment/payment.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { PaymentApiResponseType, AllPaymentsApiResponseType } from "@/types/api-response.type.ts";
import type { InitiatePaymentSchemaType } from "@/schemas/payment/create-payment.schema.ts";
import type { UpdatePaymentStatusSchemaType } from "@/schemas/payment/update-payment.schema.ts";
import type { FinalizePaymentWithEsewaSchemaType, FinalizePaymentWithKhaltiSchemaType } from "@/schemas/payment/finalize-payment.schema.ts";


// Initiate Payment Axios
export const initiatePayment = async (initiatePaymentSchema: InitiatePaymentSchemaType) => {
    try {
        const response = await axios.post<PaymentApiResponseType>(API.PAYMENT.INITIATE_PAYMENT, initiatePaymentSchema);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to initiate payment");
    }
};

// Finalize Payment Esewa Axios
export const finalizeEsewaPayment = async (paymentId: string, finalizeData: FinalizePaymentWithEsewaSchemaType) => {
    try {
        const response = await axios.put<PaymentApiResponseType>(`${API.PAYMENT.FINALIZE_PAYMENT_ESEWA}/${paymentId}`, finalizeData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to finalize Esewa payment");
    }
};

// Finalize Payment Khalti Axios
export const finalizeKhaltiPayment = async (paymentId: string, finalizeData: FinalizePaymentWithKhaltiSchemaType) => {
    try {
        const response = await axios.put<PaymentApiResponseType>(`${API.PAYMENT.FINALIZE_PAYMENT_KHALTI}/${paymentId}`, finalizeData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to finalize Khalti payment");
    }
};

// Update Payment Status Axios
export const updatePaymentStatus = async (paymentId: string, updateStatusData: UpdatePaymentStatusSchemaType) => {
    try {
        const response = await axios.put<PaymentApiResponseType>(`${API.PAYMENT.UPDATE_PAYMENT_STATUS}/${paymentId}`, updateStatusData.status);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update payment status");
    }
};

// Get Payment By Id Axios
export const getPaymentById = async (paymentId: string) => {
    try {
        const response = await axios.get<PaymentApiResponseType>(`${API.PAYMENT.GET_PAYMENT_BY_ID}/${paymentId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch payment by id");
    }
};

// Get All Payments By Buyer Id Axios
export const getAllPaymentsByBuyerId = async (buyerId: string) => {
    try {
        const response = await axios.get<AllPaymentsApiResponseType>(`${API.PAYMENT.GET_ALL_PAYMENTS_BY_BUYER_ID}/${buyerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch payments by buyer id");
    }
};

// Get All Payments By Seller Id Axios
export const getAllPaymentsBySellerId = async (sellerId: string) => {
    try {
        const response = await axios.get<AllPaymentsApiResponseType>(`${API.PAYMENT.GET_ALL_PAYMENTS_BY_SELLER_ID}/${sellerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch payments by seller id");
    }
};

// Delete Payment Axios
export const deletePayment = async (paymentId: string) => {
    try {
        const response = await axios.delete<PaymentApiResponseType>(`${API.PAYMENT.DELETE_PAYMENT}/${paymentId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete payment");
    }
};

// Get All Payments Axios
export const getAllPayments = async () => {
    try {
        const response = await axios.get<AllPaymentsApiResponseType>(API.PAYMENT.GET_ALL_PAYMENTS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all payments");
    }
};