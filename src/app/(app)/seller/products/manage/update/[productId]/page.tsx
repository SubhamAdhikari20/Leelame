// src/app/(app)/seller/products/manage/update/[productId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import UpdateProduct from "@/components/seller/update-product.tsx";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { handleGetProductById } from "@/lib/actions/product/product.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const UpdateProductPage = async ({ params }: { params: { productId: string } }) => {
    const { productId } = await params;

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

    const getProductResult = await handleGetProductById(productId);
    if (!getProductResult.success) {
        throw new Error(`Error fetching product details: ${getProductResult.message}`);
    }

    if (!getProductResult.data) {
        notFound();
    }

    const product = { ...getProductResult.data, productImageUrls: getProductResult.data.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url) => url !== null) as string[] };

    const getAllCategoriesResult = await handleGetAllCategories();
    if (!getAllCategoriesResult.success) {
        throw new Error(`Error fetching categories data: ${getAllCategoriesResult.message}`);
    }

    const categories = getAllCategoriesResult.data?.map((category) => (category)) || [];

    const getAllProductConditionsResult = await handleGetAllProductConditions();
    if (!getAllProductConditionsResult.success) {
        throw new Error(`Error fetching product conditions data: ${getAllProductConditionsResult.message}`);
    }

    const productConditions = getAllProductConditionsResult.data?.map((productCondition) => (productCondition)) || [];

    return (
        <>
            <UpdateProduct currentUser={currentUser} product={product} categories={categories} productConditions={productConditions} />
        </>
    );
};

export default UpdateProductPage;