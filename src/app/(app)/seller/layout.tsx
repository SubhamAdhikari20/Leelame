// src/app/(app)/seller/layout.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import SellerSidebar from "@/components/seller/sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { BreadcrumbProvider } from "@/components/common/breadcrumb-context.tsx";
import SiteHeader from "@/components/common/site-header.tsx";
import SiteFooter from "@/components/common/site-footer.tsx";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const SellerLayout = async ({ children }: { children: React.ReactNode }) => {
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
        throw new Error(`Error fetching user data: ${result.message ?? "Unknown"}`);
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = { ...result.data, profilePictureUrl: normalizeHttpUrl(result.data.profilePictureUrl) };

    return (
        <SidebarProvider>
            <BreadcrumbProvider>
                <SellerSidebar currentUser={currentUser} />
                <div className="min-h-screen flex-1">
                    <SiteHeader />
                    <main className="min-h-[90vh] bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                        {children}
                    </main>
                    <SiteFooter />
                </div>
            </BreadcrumbProvider>
        </SidebarProvider>
    );
};

export default SellerLayout;