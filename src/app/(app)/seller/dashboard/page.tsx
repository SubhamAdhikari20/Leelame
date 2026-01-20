// src/app/(app)/seller/dashboard/page.tsx;
"use client";
import React from "react";
import SellerSiteHeader from "@/components/seller/site-header.tsx";


const SellerDashboard = () => {
    return (
        <>
            <SellerSiteHeader />
            <section className="relative overflow-hidden px-4 md:px-0 min-h-screen flex items-center">
                Welcome to Seller Dashboard.
            </section>
        </>
    );
};

export default SellerDashboard;