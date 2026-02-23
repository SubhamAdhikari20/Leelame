// src/components/buyer/profile-dashboard.tsx
"use client";
import React from "react";
import { IndianRupee, Medal, Star } from "lucide-react";
import type { CurrentUserPropsType } from "@/types/current-user.type.ts";


const ProfileDashboard = ({ currentUser }: CurrentUserPropsType) => {
    const activityData = [
        {
            title: "Balance",
            value: 0,
            icon: <IndianRupee className="h-8 w-8 text-green-600 dark:text-green-500" />,
        },
        {
            title: "Items Won",
            value: 0,
            icon: <Medal className="h-8 w-8 text-green-600 dark:text-green-500" />,
        },
        {
            title: "Your Products",
            value: 0,
            icon: <Star className="h-8 w-8 text-green-600 dark:text-green-500" />,
        },
    ];

    return (
        <div className="w-full bg-[#d3ecdc] dark:bg-gray-900 border rounded-xl shadow-lg p-5 xl:max-w-7xl mx-auto">
            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">My Activity</h2>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activityData.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center gap-3 bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-600 rounded-2xl p-6 shadow-sm transition hover:shadow-md hover:border-green-300 dark:hover:border-gray-500 dark:hover:shadow-[0_5px_7px_1px_rgba(255,255,255,0.1),0_1px_4px_2px_rgba(255,255,255,0.1)]"
                    >
                        <div className="flex justify-center items-center">{item.icon}</div>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileDashboard;