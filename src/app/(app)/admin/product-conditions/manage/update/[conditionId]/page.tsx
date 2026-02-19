// src/app/(app)/admin/product-conditions/manage/update/[conditionId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import UpdateProductCondition from "@/components/admin/update-product-condition.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetProductConditionById } from "@/lib/actions/product-condition/condition.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const UpdateProductConditionPage = async ({ params }: { params: { conditionId: string } }) => {
    const { conditionId } = await params;

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

    const getProductConditionResult = await handleGetProductConditionById(conditionId);
    if (!getProductConditionResult.success) {
        throw new Error(`Error fetching product condition details: ${getProductConditionResult.message}`);
    }

    const productConditionData = getProductConditionResult.data;

    if (!productConditionData) {
        notFound();
    }

    return (
        <>
            <UpdateProductCondition currentUser={currentUser} productCondition={productConditionData} />
        </>
    );
};

export default UpdateProductConditionPage;