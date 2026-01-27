// src/app/(app)/seller/layout.tsx
import React from "react";
import { getServerSession } from "next-auth/next";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { authOptions } from "@/app/api/auth/[...nextauth]/options.ts";
import { notFound, redirect } from "next/navigation";
import SellerSidebar from "@/components/seller/sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { BreadcrumbProvider } from "@/components/common/breadcrumb-context.tsx";
import SiteHeader from "@/components/common/site-header.tsx";
import SiteFooter from "@/components/common/site-footer.tsx";


const SellerLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
        redirect("/seller/login");
    }
    const result = await handleGetCurrentSellerUser(session.user._id);

    if (!result.success) {
        throw new Error(`Error fetching user data: ${result.message ?? "Unknown"}`);
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = result.data;

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