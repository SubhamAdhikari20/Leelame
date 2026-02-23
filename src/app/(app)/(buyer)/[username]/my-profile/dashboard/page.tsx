// src/app/(app)/(buyer)/[usename]/my-profile/dashboard/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import ProfileDashboard from "@/components/buyer/profile-dashboard.tsx";


const ProfileDashboardPage = async () => {
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

    return (
        <>
            <ProfileDashboard currentUser={currentUser} />
        </>
    );
};

export default ProfileDashboardPage;