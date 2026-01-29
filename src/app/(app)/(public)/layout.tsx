// src/app/(app)/(public)/layout.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";


const AppLayout = async ({ children }: { children: React.ReactNode }) => {
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
            <Navbar currentUser={currentUser} />
            <main className="bg-size-[20px_20px] min-h-[90vh] bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {children}
            </main>
            <Footer currentUser={currentUser} />
        </>
    );
};

export default AppLayout;