// src/app/(app)/layout.tsx
"use client";
import React from "react";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
import { useSession } from "next-auth/react";


const AppLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const { data: session, status } = useSession();
    
    // if (!session || !session.user) {
    //     return null;
    // }

    const currentUser = session?.user;

    return (
        <>
            <Navbar currentUser={currentUser} />
            {children}
            <Footer currentUser={currentUser} />
        </>
    );
};

export default AppLayout;