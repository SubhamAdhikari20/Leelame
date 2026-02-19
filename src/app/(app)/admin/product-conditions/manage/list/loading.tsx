// src/app/(app)/admin/product-conditions/manage/list/loading.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";


const SellerListLoading = () => {
    const cols = ["Id", "Profile", "Name", "Email", "Contact", "Actions"];
    return (
        <section className="p-4 md:p-6 w-full xl:max-w-7xl" aria-busy="true" aria-label="Loading sellers list">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Button variant="outline" disabled className="border-green-500 text-green-600 dark:text-white">
                    <Skeleton className="mr-1 h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                </Button>
            </div>

            <div className="overflow-x-auto rounded-md border shadow-sm">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-green-600 hover:bg-green-500">
                            {cols.map((c) => (
                                <TableHead key={c} className="p-3 text-left text-white font-semibold text-sm">
                                    <Skeleton className="h-4 w-24 inline-block" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <TableRow key={idx} className="even:bg-gray-50 dark:even:bg-gray-900">
                                <TableCell className="p-3"><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell className="p-3"><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell className="p-3"><Skeleton className="h-5 w-56" /></TableCell>
                                <TableCell className="p-3"><Skeleton className="h-5 w-36" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
};

export default SellerListLoading;