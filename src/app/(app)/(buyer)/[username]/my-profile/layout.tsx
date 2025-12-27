// src/(app)/(buyer)/[usename]/my-profile/layout.tsx
import React from "react";
import Sidebar from "@/components/buyer/sidebar.tsx";


const ProfileLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <section className="container mx-auto px-5 py-10 flex gap-10 flex-col md:flex-row">
                {/* Sidebar Section */}
                <Sidebar />
                {/* Main Content */}
                <div className="flex-1">
                    {children}
                </div>
            </section>
        </>
    );
};

export default ProfileLayout;