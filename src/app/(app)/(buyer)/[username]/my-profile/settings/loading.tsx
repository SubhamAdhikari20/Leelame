// src/app/(app)/(buyer)/[username]/my-profile/settings/loading.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";


const FieldSkeleton = ({ labelWidth = "w-24" }: { labelWidth?: string }) => {
    return (
        <div className="space-y-2">
            <Skeleton className={`${labelWidth} h-4`} />
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
}

const BuyerProfilePageLoading = () => {
    return (
        <section
            className="w-full xl:max-w-7xl p-5 animate-pulse"
            aria-busy="true"
            aria-label="Loading profile"
        >
            <h1 className="sr-only">Loading profile</h1>

            <div className="flex flex-col xl:flex-row xl:justify-evenly gap-6 justify-center">
                {/* Left column: avatar + image actions + delete */}
                <aside className="flex flex-col items-center gap-6 xl:min-w-[310px]">
                    {/* Avatar circle */}
                    <div className="flex items-center justify-center">
                        <Skeleton className="rounded-full h-36 w-36 lg:h-48 lg:w-48 border-2 border-gray-200 dark:border-gray-700" />
                    </div>

                    {/* Name / username placeholders */}
                    <div className="w-full flex flex-col items-center gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Image action buttons */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 w-40 rounded-md" />
                            <Skeleton className="h-10 w-28 rounded-md" />
                        </div>

                        <Skeleton className="h-10 w-44 rounded-md" />
                    </div>

                    {/* Delete account button */}
                    <div className="mt-auto">
                        <Skeleton className="h-10 w-48 rounded-md" />
                    </div>
                </aside>

                {/* Right column: form skeleton */}
                <main className="w-full flex-1 max-w-2xl xl:max-w-xl space-y-6 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-4 w-52" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form className="space-y-6">
                                {/* Full name */}
                                <FieldSkeleton labelWidth="w-24" />

                                {/* Username */}
                                <FieldSkeleton labelWidth="w-28" />

                                {/* Email */}
                                <FieldSkeleton labelWidth="w-28" />

                                {/* Contact */}
                                <FieldSkeleton labelWidth="w-20" />

                                {/* Buttons row */}
                                <div className="flex items-center justify-evenly gap-3 pt-2">
                                    <Skeleton className="h-11 w-40 rounded-md" />
                                    <Skeleton className="h-11 w-32 rounded-md" />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </section>
    );
};

export default BuyerProfilePageLoading;