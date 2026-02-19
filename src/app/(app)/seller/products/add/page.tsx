// src/app/(app)/seller/products/add/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import AddProducts from "@/components/seller/add-product.tsx";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const SellerAddProducts = async () => {
    const response = await getServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

    const token = response.token;
    const user = response.data;
    if (!token || !user || !user._id) {
        redirect("/become-seller");
    }

    const getCurrentUserResult = await handleGetCurrentSellerUser(user._id);
    if (!getCurrentUserResult.success) {
        throw new Error("Error fetching user data");
    }

    if (!getCurrentUserResult.data) {
        notFound();
    }

    const currentUser = { ...getCurrentUserResult.data, profilePictureUrl: normalizeHttpUrl(getCurrentUserResult.data.profilePictureUrl) };

    const getAllCategoriesResult = await handleGetAllCategories();
    if (!getAllCategoriesResult.success) {
        throw new Error(`Error fetching categories data: ${getAllCategoriesResult.message}`);
    }

    const categories = getAllCategoriesResult.data?.map((category) => (category)) || [];

    return (
        <>
            <AddProducts currentUser={currentUser} categories={categories} />
        </>
    );
};

export default SellerAddProducts;