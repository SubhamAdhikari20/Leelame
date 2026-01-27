// src/(app)/(buyer)/[usename]/my-profile/layout.tsx
import React from "react";
import { getCurrentServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import Sidebar from "@/components/buyer/sidebar.tsx";


const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
    const response = await getCurrentServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const session = response.session;
    if (!session || !session.user._id) {
        redirect("/login");
    }

    const result = await handleGetCurrentBuyerUser(session.user._id);
    if (!result.success) {
        throw new Error(`Error fetching user data: ${result.message ?? "Unknown"}`);
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = result.data;

    return (
        <>
            <section className="container mx-auto px-5 py-10 flex gap-10 flex-col md:flex-row">
                {/* Sidebar Section */}
                <Sidebar currentUser={currentUser} />
                {/* Main Content */}
                <div className="flex-1">
                    {children}
                </div>
            </section>
        </>
    );
};

export default ProfileLayout;