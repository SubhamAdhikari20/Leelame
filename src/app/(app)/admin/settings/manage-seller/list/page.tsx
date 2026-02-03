// src/app/(app)/admin/settings/manage-seller/list/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ListSeller from "@/components/admin/list-seller.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetAllSellers } from "@/lib/actions/admin/manage-seller.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const AdminListSellerPage = async () => {
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

    const currentUser = getCurrentUserResult.data;

    const getAllSellersResult = await handleGetAllSellers();
    if (!getAllSellersResult.success) {
        throw new Error(`Error fetching user data: ${getAllSellersResult.message}`);
    }

    const sellers = getAllSellersResult.data?.map((seller) => ({
        ...seller,
        profilePictureUrl: normalizeHttpUrl(seller.profilePictureUrl),
    })) || [];

    // console.log(sellers?.map((seller) => seller.profilePictureUrl));

    return (
        <>
            <ListSeller currentUser={currentUser} sellers={sellers} />
        </>
    );
};

export default AdminListSellerPage;