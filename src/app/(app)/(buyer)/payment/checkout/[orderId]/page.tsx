// src/app/(app)/(buyer)/payment/checkout/[orderId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { handleGetOrderById } from "@/lib/actions/order/order.action.ts";
import { notFound, redirect } from "next/navigation";
import Checkout from "@/components/buyer/checkout.tsx";


const CheckoutPage = async ({ params }: { params: { orderId: string } }) => {
    const { orderId } = await params;

    const response = await getServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const token = response.token;
    const user = response.data;
    if (!token || !user || !user._id) {
        redirect("/login");
    }

    const result = await handleGetCurrentBuyerUser(user._id);
    if (!result.success) {
        throw new Error(`Error fetching user data: ${result.message ?? "Unknown"}`);
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = result.data;

    const orderResult = await handleGetOrderById(orderId);
    if (!orderResult.success || !orderResult.data) {
        throw new Error(`Error fetching order data: ${orderResult.message ?? "Unknown"}`);
    }

    const order = orderResult.data;

    return (
        <>
            <Checkout currentUser={currentUser} order={order} />
        </>
    );
};

export default CheckoutPage;