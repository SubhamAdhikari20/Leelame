// src/app/(app)/admin/product-conditions/add/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import AddProductCondition from "@/components/admin/add-product-condition.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const AddProductConditionPage = async () => {
    const response = await getServerSession();
    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const token = response.token;
    const user = response.data;
    if (!token || !user || !user._id) {
        redirect("/admin/login");
    }

    const getCurrentUserResult = await handleGetCurrentAdminUser(user._id);
    if (!getCurrentUserResult.success) {
        throw new Error("Error fetching user data");
    }

    if (!getCurrentUserResult.data) {
        notFound();
    }

    const currentUser = { ...getCurrentUserResult.data, profilePictureUrl: normalizeHttpUrl(getCurrentUserResult.data.profilePictureUrl) };

    return (
        <>
            <AddProductCondition currentUser={currentUser} />
        </>
    );
};

export default AddProductConditionPage;