// src/lib/actions/invoice/invoice.action.ts
"use server";
import { getInvoiceById, getInvoiceByTransactionId } from "@/lib/api/invoice/invoice.api.ts";


// Get Invoice By Id Handler
export const handleGetInvoiceById = async (invoiceId: string) => {
    try {
        const result = await getInvoiceById(invoiceId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch invoice by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Invoice fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching invoice by id!"
        };
    }
};

// Get Invoice By Transaction Id Handler
export const handleGetInvoiceByTransactionId = async (transactionId: string) => {
    try {
        const result = await getInvoiceByTransactionId(transactionId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch invoice by transaction id!"
            };
        }
        return {
            success: true,
            message: result.message || "Invoice fetched by transaction id successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching invoice by transaction id!"
        };
    }
};