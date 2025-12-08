// src/app/(app)/layout.tsx
"use client";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";
// import useSWR from "swr";

const AppLayout = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const currentUser = session?.user ?? null;

    // const userId = session?.user?._id;
    // const { data: dbUser, error, isLoading: userLoading } = useSWR<User | null>(
    //     userId ? `/api/auth/edit-profile/${userId}` : null,
    //     fetcher,
    //     {
    //         refreshInterval: 3_000,
    //         revalidateOnFocus: true,
    //     }
    // );

    // if (status === "loading" || (session && userLoading)) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <Loader2 className="animate-spin h-8 w-8" />
    //         </div>
    //     );
    // }


    return (
        <>
            <Navbar currentUser={currentUser} />
            <main className="bg-size-[20px_20px] min-h-[90vh] bg-gray-100 dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-300">
                {children}
            </main>
            <Footer currentUser={currentUser} />
        </>
    );
};

export default AppLayout;