// src/app/(app)/admin/product-conditions/manage/list/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ListProductConditions from "@/components/admin/list-product-conditions.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const ManageProductConditions = async () => {
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

    const getAllProductConditionsResult = await handleGetAllProductConditions();
    if (!getAllProductConditionsResult.success) {
        throw new Error(`Error fetching product conditions data: ${getAllProductConditionsResult.message}`);
    }

    const productConditions = getAllProductConditionsResult.data?.map((productCondition) => (productCondition)) || [];

    return (
        <>
            <ListProductConditions currentUser={currentUser} productConditions={productConditions} />
        </>
    );
};

export default ManageProductConditions;