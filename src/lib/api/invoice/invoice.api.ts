// src/lib/api/invoice/invoice.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { InvoiceApiResponseType } from "@/types/api-response.type.ts";


// Get Invoice By Id Axios
export const getInvoiceById = async (invoiceId: string) => {
    try {
        const response = await axios.get<InvoiceApiResponseType>(`${API.INVOICE.GET_INVOICE_BY_ID}/${invoiceId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch invoice by id");
    }
};

// Get Invoice By Transaction Id Axios
export const getInvoiceByTransactionId = async (transactionId: string) => {
    try {
        const response = await axios.get<InvoiceApiResponseType>(`${API.INVOICE.GET_INVOICE_BY_TRANSACTION_ID}/${transactionId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch invoice by transaction id");
    }
};