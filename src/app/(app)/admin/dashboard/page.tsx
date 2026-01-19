// src/app/(app)/admin/dashboard/page.tsx;
"use client";
import React from "react";
import AdminSiteHeader from "@/components/admin/site-header.tsx";


const AdminDashboard = () => {
    return (
        <>
            <AdminSiteHeader />
            <section className="relative overflow-hidden px-4 md:px-0 min-h-screen flex items-center">
                Welcome to Admin Dashboard.
            </section>
        </>
    );
};

export default AdminDashboard;