// src/app/(app)/seller/settings/account/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import SellerProfile from "@/components/seller/seller-profile.tsx";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const SellerProfilePage = async () => {
    const response = await getServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const token = response.token;
    const user = response.data;
    if (!token || !user || !user._id) {
        redirect("/login");
    }

    const result = await handleGetCurrentSellerUser(user._id);
    if (!result.success) {
        throw new Error("Error fetching user data");
    }

    if (!result.data) {
        notFound();
    }

   const currentUser = { ...result.data, profilePictureUrl: normalizeHttpUrl(result.data.profilePictureUrl) };

    return (
        <>
            <SellerProfile currentUser={currentUser} />
        </>
    );
};

export default SellerProfilePage;