// src/app/(app)/seller/settings/account/page.tsx
import React from "react";
import { getCurrentServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import SellerProfile from "@/components/seller/seller-profile.tsx";


const SellerProfilePage = async () => {
    const response = await getCurrentServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const session = response.session;
    if (!session || !session.user._id) {
        redirect("/seller/login");
    }

    const result = await handleGetCurrentSellerUser(session.user._id);
    if (!result.success) {
        throw new Error("Error fetching user data");
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = result.data;

    return (
        <>
            <SellerProfile currentUser={currentUser} />
        </>
    );
};

export default SellerProfilePage;