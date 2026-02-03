// src/app/(app)/admin/settings/account/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import AdminProfile from "@/components/admin/admin-profile.tsx";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const AdminProfilePage = async () => {
    const response = await getServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const token = response.token;
    const user = response.data;
    if (!token || !user || !user._id) {
        redirect("/admin/login");
    }

    const result = await handleGetCurrentAdminUser(user._id);
    if (!result.success) {
        throw new Error("Error fetching user data");
    }

    if (!result.data) {
        notFound();
    }

    // const currentUser = result.data;
    const currentUser = { ...result.data, profilePictureUrl: normalizeHttpUrl(result.data.profilePictureUrl) };

    return (
        <>
            <AdminProfile currentUser={currentUser} />
        </>
    );
};

export default AdminProfilePage;