// src/app/(app)/[username]/page.tsx
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Home from "@/components/home-user.tsx";


const HomePage = () => {
    const { data: session } = useSession();
    const currentUser = session?.user ?? null;

    return <Home currentUser={currentUser} />;
};

export default HomePage;