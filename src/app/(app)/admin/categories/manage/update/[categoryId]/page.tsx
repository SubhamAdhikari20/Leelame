// src/app/(app)/admin/categories/manage/update/[categoryId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import UpdateCategory from "@/components/admin/update-category.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetCategoryById } from "@/lib/actions/category/category.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const UpdateCategoryPage = async ({ params }: { params: { categoryId: string } }) => {
    const { categoryId } = await params;

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

    const getCategoryResult = await handleGetCategoryById(categoryId);
    if (!getCategoryResult.success) {
        throw new Error(`Error fetching category details: ${getCategoryResult.message}`);
    }

    const categoryData = getCategoryResult.data;

    return (
        <>
            <UpdateCategory currentUser={currentUser} category={categoryData} />
        </>
    );
};

export default UpdateCategoryPage;