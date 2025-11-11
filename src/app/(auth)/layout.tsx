// src/app/(auth)/layout.tsx
"use client";
import React from "react";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";


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