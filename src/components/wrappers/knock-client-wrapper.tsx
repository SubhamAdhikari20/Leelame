// src/components/wrappers/knock-client-wrapper.tsx
"use client";
import React, { useEffect } from "react";
import { KnockFeedProvider, KnockProvider } from "@knocklabs/react";
// @ts-ignore - CSS file has no type declarations; consider adding a global declaration (e.g. src/global.d.ts: declare module '*.css';)
import "@knocklabs/react/dist/index.css";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { ApiResponse } from "@/types/api-response.ts";


const KnockClientWrapper = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        const createAndUpdateKnockUser = async () => {
            if (status === "authenticated" && session.user?._id) {
                try {
                    // Handle multiple user roles
                    const role = session.user.role;
                    let fullName = "User";

                    if (role === "buyer" && session.user.buyerProfile) {
                        fullName = (session.user.fullName || session.user.username) ?? "Buyer";
                    }
                    else if (role === "seller" && session.user.sellerProfile) {
                        fullName = session.user.fullName ?? "Seller";
                    }
                    else if (role === "admin" && session.user.adminProfile) {
                        fullName = session.user.fullName ?? "Admin";
                    }

                    const response = await axios.post("/api/notifications/knock/update-user", {
                        data: {
                            userId: session.user._id,
                            fullName: fullName,
                            email: session.user.email,
                        }
                    });

                    if (!response.data.success) {
                        console.error("Failed to update Knock user:", response.data.message);
                    }
                }
                catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    console.error("Error updating Knock user:", axiosError);
                }
            }
        };

        createAndUpdateKnockUser();
    }, [status, session]);

    // Validate environment variables at runtime
    const apiKey = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY;
    if (!apiKey) {
        console.error("NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY is missing. Please set it in your .env file.");
        return <>{children}</>;
    }

    const feedId = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_FEED_ID;
    if (!feedId) {
        console.error("NEXT_PUBLIC_KNOCK_PUBLIC_FEED_ID is missing. Please set it in your .env file.");
        return <>{children}</>;
    }

    if (status !== "authenticated" || !session?.user?._id) {
        return <>{children}</>;
    }

    return (
        <KnockProvider apiKey={apiKey} user={{ id: session.user._id }}>
            <KnockFeedProvider feedId={feedId}>
                {children}
            </KnockFeedProvider>
        </KnockProvider>
    );
};

export default KnockClientWrapper;