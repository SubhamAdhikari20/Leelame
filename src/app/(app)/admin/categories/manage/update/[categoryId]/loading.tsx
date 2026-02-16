// src/app/(app)/admin/categories/manage/update/[categoryId]/loading.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";


const Loading = () => {
    return (
        <section className="w-full xl:max-w-7xl p-5 animate-pulse" aria-busy="true" aria-label="Loading seller profile">
            <h1 className="sr-only">Loading</h1>

            <Card className="space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-700 p-8 rounded-lg shadow-lg">
                <CardContent className="w-full max-w-2xl xl:max-w-xl">
                    <form className="space-y-10">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-50 w-full rounded-md" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                        </div>

                        <div className="flex items-center justify-evenly gap-2">
                            <Skeleton className="h-11 w-40 rounded-md" />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}

export default Loading;