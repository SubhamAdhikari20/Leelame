// src/lib/api/order/order.api.ts
import axios, { AxiosErrorType } from "@/lib/api/axios.ts";
import { API } from "@/lib/api/endpoints.ts";
import type { AllOrdersApiResponseType, OrderApiResponseType } from "@/types/api-response.type.ts";
import type { CreateOrderSchemaType } from "@/schemas/order/create-order.schema.ts";


// Create Order Axios
export const createOrder = async (orderData: CreateOrderSchemaType) => {
    try {
        const response = await axios.post<OrderApiResponseType>(API.ORDER.CREATE_ORDER, orderData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to create order");
    }
};

// Get Order By Id Axios
export const getOrderById = async (orderId: string) => {
    try {
        const response = await axios.get<OrderApiResponseType>(`${API.ORDER.GET_ORDER_BY_ID}/${orderId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch order by id");
    }
};

// Get All Orders By Buyer Id Axios
export const getAllOrdersByBuyerId = async (buyerId: string) => {
    try {
        const response = await axios.get<AllOrdersApiResponseType>(`${API.ORDER.GET_ALL_ORDERS_BY_BUYER_ID}/${buyerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch orders by buyer id");
    }
};

// Get All Orders By Seller Id Axios
export const getAllOrdersBySellerId = async (sellerId: string) => {
    try {
        const response = await axios.get<AllOrdersApiResponseType>(`${API.ORDER.GET_ALL_ORDERS_BY_SELLER_ID}/${sellerId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch orders by seller id");
    }
};

// Get All Orders Axios
export const getAllOrders = async () => {
    try {
        const response = await axios.get<AllOrdersApiResponseType>(API.ORDER.GET_ALL_ORDERS);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to fetch all orders");
    }
};

// Update Order Status Axios
export const updateOrderStatus = async (orderId: string, status: string) => {
    try {
        const response = await axios.put<OrderApiResponseType>(`${API.ORDER.UPDATE_ORDER_STATUS}/${orderId}`, { status });
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update order status");
    }
};

// Update Order Details Axios
export const updateOrderDetails = async (orderId: string, orderData: Partial<CreateOrderSchemaType>) => {
    try {
        const response = await axios.put<OrderApiResponseType>(`${API.ORDER.UPDATE_ORDER_DETAILS}/${orderId}`, orderData);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to update order details");
    }
};

// Delete Order Axios
export const deleteOrder = async (orderId: string) => {
    try {
        const response = await axios.delete<OrderApiResponseType>(`${API.ORDER.DELETE_ORDER}/${orderId}`);
        return response.data;
    }
    catch (error: Error | any) {
        const axiosError = error as AxiosErrorType;
        throw new Error(axiosError.response?.data.message || "Failed to delete order");
    }
};