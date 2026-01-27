// src/app/(app)/seller/settings/account/page.tsx
import { getServerSession } from "next-auth/next";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { authOptions } from "@/app/api/auth/[...nextauth]/options.ts";
import { notFound, redirect } from "next/navigation";
import SellerProfile from "@/components/seller/seller-profile.tsx";
// import { CurrentUser } from "@/types/current-user.ts";


const SellerProfilePage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
        redirect("/seller/login");
    }
    const result = await handleGetCurrentSellerUser(session.user._id);

    if (!result.success) {
        throw new Error("Error fetching user data");
    }

    if (!result.data) {
        notFound();
    }

    const currentUser = result.data;

    return (
        <>
            <SellerProfile currentUser={currentUser} />
        </>
    );
};

export default SellerProfilePage;