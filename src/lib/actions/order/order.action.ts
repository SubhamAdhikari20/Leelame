// src/lib/actions/order/order.action.ts
"use server";
import { createOrder, updateOrderDetails, updateOrderStatus, deleteOrder, getOrderById, getAllOrdersByBuyerId, getAllOrdersBySellerId, getAllOrders } from "@/lib/api/order/order.api.ts";
import type { CreateOrderSchemaType } from "@/schemas/order/create-order.schema.ts";
import type { UpdateOrderDetailsSchemaType, UpdateOrderStatusSchemaType } from "@/schemas/order/update-order.schema.ts";


// Create Order Handler
export const handleCreateOrder = async (createOrderSchema: CreateOrderSchemaType) => {
    try {
        const result = await createOrder(createOrderSchema);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to create order!"
            };
        }
        return {
            success: true,
            message: result.message || "Order created successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while creating order!"
        };
    }
};

// Update Order Details Handler
export const handleUpdateOrderDetails = async (orderId: string, updateData: Partial<UpdateOrderDetailsSchemaType>) => {
    try {
        const result = await updateOrderDetails(orderId, updateData);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to update order details!"
            };
        }
        return {
            success: true,
            message: result.message || "Order details updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating order details!"
        };
    }
};

// Update Order Status Handler
export const handleUpdateOrderStatus = async (orderId: string, updateStatusData: UpdateOrderStatusSchemaType) => {
    try {
        const result = await updateOrderStatus(orderId, updateStatusData.status);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to update order status!"
            };
        }
        return {
            success: true,
            message: result.message || "Order status updated successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while updating order status!"
        };
    }
};


// Get Order By Id Handler
export const handleGetOrderById = async (orderId: string) => {
    try {
        const result = await getOrderById(orderId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch order by id!"
            };
        }
        return {
            success: true,
            message: result.message || "Order fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching order by id!"
        };
    }
};

// Delete Order Handler
export const handleDeleteOrder = async (orderId: string) => {
    try {
        const result = await deleteOrder(orderId);
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete order!"
            };
        }
        return {
            success: true,
            message: result.message || "Order deleted successfully.",
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting order!"
        };
    }
};

// Get All Orders By Buyer Id Handler
export const handleGetAllOrdersByBuyerId = async (buyerId: string) => {
    try {
        const result = await getAllOrdersByBuyerId(buyerId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch orders by buyer id!"
            };
        }
        return {
            success: true,
            message: result.message || "Orders fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching orders by buyer id!"
        };
    }
};

// Get All Orders By Seller Id Handler
export const handleGetAllOrdersBySellerId = async (sellerId: string) => {
    try {
        const result = await getAllOrdersBySellerId(sellerId);
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch orders by seller id!"
            };
        }
        return {
            success: true,
            message: result.message || "Orders fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching orders by seller id!"
        };
    }
};

// Get All Orders Handler
export const handleGetAllOrders = async () => {
    try {
        const result = await getAllOrders();
        if (!result.success || !result.data) {
            return {
                success: false,
                message: result.message || "Failed to fetch all the orders!",
            };
        }
        return {
            success: true,
            message: result.message || "All orders fetched successfully.",
            data: result.data
        };
    }
    catch (error: Error | any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred while fetching all orders!"
        };
    }
};