// src/app/(app)/admin/settings/manage-seller/create/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import CreateSeller from "@/components/admin/create-seller";


const AdminCreateSellerPage = async () => {
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

    return (
        <>
            <CreateSeller currentUser={currentUser} />
        </>
    );
};

export default AdminCreateSellerPage;