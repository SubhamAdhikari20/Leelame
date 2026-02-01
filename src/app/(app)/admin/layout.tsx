// src/app/(app)/admin/layout.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { BreadcrumbProvider } from "@/components/common/breadcrumb-context.tsx";
import SiteHeader from "@/components/common/site-header.tsx";
import SiteFooter from "@/components/common/site-footer.tsx";


const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
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
        throw new Error(`Error fetching user data: ${result.message ?? "Unknown"}`);
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = result.data;

    return (
        <SidebarProvider>
            <BreadcrumbProvider currentUser={currentUser}>
                <AdminSidebar currentUser={currentUser} />
                <div className="min-h-screen flex-1">
                    <SiteHeader currentUser={currentUser} />
                    <main className="min-h-[90vh] bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                        {children}
                    </main>
                    <SiteFooter />
                </div>
            </BreadcrumbProvider>
        </SidebarProvider>
    );
};

export default AdminLayout;