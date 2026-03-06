// src/app/(app)/(buyer)/payment/receipt/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import Reciept from "@/components/buyer/reciept.tsx";
import { handleGetInvoiceByTransactionId } from "@/lib/actions/invoice/invoice.action";


const ReceiptPage = async ({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {
    const resolvedSearchParams = await searchParams;
    const transaction_id = resolvedSearchParams?.transaction_id || resolvedSearchParams?.transaction_uuid;
    const status = resolvedSearchParams?.status;

    if (!transaction_id || typeof transaction_id !== "string" || transaction_id.trim() === "") {
        throw new Error("Transaction ID is required and must be a string.");
    }

    if (!status || typeof status !== "string" || status.trim() === "") {
        throw new Error("Status is required and must be a string.");
    }

    console.log("Transaction ID:", transaction_id);
    console.log("Status:", status);

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

    const getInvoiceResult = await handleGetInvoiceByTransactionId(transaction_id.toString());
    if (!getInvoiceResult.success || !getInvoiceResult.data) {
        throw new Error(`Error fetching invoice data: ${getInvoiceResult.message ?? "Unknown"}`);
    }

    const invoice = getInvoiceResult.data;

    const isSuccess = status === "success";

    return (
        <>
            <Reciept
                currentUser={currentUser}
                invoice={invoice}
                isSuccess={isSuccess}
            />
        </>
    );
}

export default ReceiptPage;