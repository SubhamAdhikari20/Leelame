// src/lib/actions/payment/payment.action.ts
"use server";
import { initiatePayment, finalizeEsewaPayment, finalizeKhaltiPayment, updatePaymentStatus, deletePayment, getPaymentById, getAllPaymentsByBuyerId, getAllPaymentsBySellerId, getAllPayments } from "@/lib/api/payment/payment.api.ts";
import type { InitiatePaymentSchemaType } from "@/schemas/payment/create-payment.schema.ts";
import type { UpdatePaymentStatusSchemaType } from "@/schemas/payment/update-payment.schema";
import type { FinalizePaymentWithEsewaSchemaType, FinalizePaymentWithKhaltiSchemaType } from "@/schemas/payment/finalize-payment.schema.ts";


// Create Payment Handler
export const handleInitiatePayment = async (initiatePaymentSchema: InitiatePaymentSchemaType) => {
    try {
        const result = await initiatePayment(initiatePaymentSchema);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to initiate payment!"
            };
        }
        return {
            success: true,
            message: result.message || "Payment initiated successfully.",
            data: result.data,
            formData: result.formData,
            paymentUrl: result.gatewayUrl
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while initiating payment!"
        };
    }
};

// Finalize Esewa Payment Handler
export const handleFinalizeEsewaPayment = async (paymentId: string, finalizeData: FinalizePaymentWithEsewaSchemaType) => {
    try {
        const result = await finalizeEsewaPayment(paymentId, finalizeData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to finalize Esewa payment!"
            };
        }
        return {
            success: true,
            message: result.message || "Esewa payment finalized successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while finalizing Esewa payment!"
        };
    }
};

// Finalize Khalti Payment Handler
export const handleFinalizeKhaltiPayment = async (paymentId: string, finalizeData: FinalizePaymentWithKhaltiSchemaType) => {
    try {
        const result = await finalizeKhaltiPayment(paymentId, finalizeData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to finalize Khalti payment!"
            };
        }
        return {
            success: true,
            message: result.message || "Khalti payment finalized successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while finalizing Khalti payment!"
        };
    }
};

// Update Payment Status Handler
export const handleUpdatePaymentStatus = async (paymentId: string, updateStatusData: UpdatePaymentStatusSchemaType) => {
    try {
        const result = await updatePaymentStatus(paymentId, updateStatusData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to update payment status!"
            };
        }
        return {
            success: true,
            message: result.message || "Payment status updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating payment status!"
        };
    }
};

// Get Payment By Id Handler
export const handleGetPaymentById = async (paymentId: string) => {
    try {
        const result = await getPaymentById(paymentId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch payment by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Payment fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching payment by id!"
        };
    }
};

// Delete Payment Handler
export const handleDeletePayment = async (paymentId: string) => {
    try {
        const result = await deletePayment(paymentId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete payment!"
            };
        }
        return {
            success: true,
            message: result.message || "Payment deleted successfully.",
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting payment!"
        };
    }
};

// Get All Payments By Buyer Id Handler
export const handleGetAllPaymentsByBuyerId = async (buyerId: string) => {
    try {
        const result = await getAllPaymentsByBuyerId(buyerId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch payments by buyer id!"
            };
        }
        return {
            success: true,
            message: result.message || "Payments fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching payments by buyer id!"
        };
    }
};

// Get All Payments By Seller Id Handler
export const handleGetAllPaymentsBySellerId = async (sellerId: string) => {
    try {
        const result = await getAllPaymentsBySellerId(sellerId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch payments by seller id!"
            };
        }
        return {
            success: true,
            message: result.message || "Payments fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching payments by seller id!"
        };
    }
};

// Get All Payments Handler
export const handleGetAllPayments = async () => {
    try {
        const result = await getAllPayments();
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the payments!",
            };
        }
        return {
            success: true,
            message: result.message || "All payments fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all payments!"
        };
    }
};