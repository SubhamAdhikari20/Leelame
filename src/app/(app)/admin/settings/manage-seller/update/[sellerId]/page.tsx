// src/app/(app)/admin/settings/manage-seller/update/[sellerId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import UpdateSeller from "@/components/admin/update-seller.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetSellerById } from "@/lib/actions/admin/manage-seller.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const AdminUpdateSellerPage = async ({ params }: { params: { sellerId: string } }) => {
    const { sellerId } = await params;
    const response = await getServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const token = response.token;
    const user = response.data;
    if (!token || !user || !user._id) {
        redirect("/admin/login");
    }

    const getCurrentUserResult = await handleGetCurrentAdminUser(user._id);
    if (!getCurrentUserResult.success) {
        throw new Error("Error fetching user data");
    }

    if (!getCurrentUserResult.data) {
        notFound();
    }

    const currentUser = { ...getCurrentUserResult.data, profilePictureUrl: normalizeHttpUrl(getCurrentUserResult.data.profilePictureUrl) };

    const getSellerResult = await handleGetSellerById(sellerId);
    if (!getSellerResult.success || !getSellerResult.data) {
        notFound();
    }

    const seller = { ...getSellerResult.data, profilePictureUrl: normalizeHttpUrl(getSellerResult.data.profilePictureUrl) };

    return (
        <>
            <UpdateSeller currentUser={currentUser} seller={seller} />
        </>
    );
};

export default AdminUpdateSellerPage;