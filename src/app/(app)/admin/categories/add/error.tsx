// src/app/(app)/admin/categories/add/error.tsx
"use client";
import { Button } from "@/components/ui/button.tsx";
import { useEffect } from "react";


const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="min-h-[90vh] flex flex-col justify-center items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl animate-bounce" >Something went wrong!</h2>
            <Button
                className="cursor-pointer"
                onClick={
                    () => reset()
                }
            >
                Try again
            </Button>
        </section>
    );
};

export default Error;