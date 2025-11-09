// src/app/(auth)/layout.tsx
"use client";
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";


const AppLayout = ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

export default AppLayout;