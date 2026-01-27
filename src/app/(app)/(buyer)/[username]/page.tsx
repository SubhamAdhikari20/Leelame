// src/app/(app)/(buyer)/[username]/page.tsx
import React from "react";
import { getCurrentServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import Home from "@/components/home-user.tsx";


const HomePage = async () => {
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
            <Home currentUser={currentUser} />
        </>
    );
};

export default HomePage;