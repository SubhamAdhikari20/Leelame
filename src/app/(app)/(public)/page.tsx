// src/app/(app)page.tsx
"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Home from "@/components/home-user.tsx";


const HomePage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const username = session?.user?.username;
    useEffect(() => {
        if (username) {
            router.replace(`/${username}`);
        }
    }, [username]);

    return <Home />;
}

export default HomePage;