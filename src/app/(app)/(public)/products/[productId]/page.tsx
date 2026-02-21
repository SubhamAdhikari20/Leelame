// src/app/(app)/(public)/products/[productId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ProductViewDetailsPublic from "@/components/common/product-view-details-public.tsx";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { handleGetProductById } from "@/lib/actions/product/product.action.ts";
import { handleGetSellerById } from "@/lib/actions/seller/profile-details.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";
import type { CurrentUserType } from "@/types/current-user.type.ts";


const ProductViewDetailsPublicPage = async ({ params }: { params: { productId: string } }) => {
    const { productId } = await params;

    const response = await getServerSession();
    let currentUser: CurrentUserType | null | undefined;

    if (response.success) {
        const token = response.token;
        const user = response.data;

        if (!token || !user || !user._id) {
            redirect("/login");
        }

        const getCurrentUserResult = await handleGetCurrentBuyerUser(user._id);
        if (!getCurrentUserResult.success) {
            throw new Error("Error fetching current user data");
        }

        if (!getCurrentUserResult.data) {
            notFound();
        }

        currentUser = { ...getCurrentUserResult.data, profilePictureUrl: normalizeHttpUrl(getCurrentUserResult.data.profilePictureUrl) };
    }

    const getProductResult = await handleGetProductById(productId);
    if (!getProductResult.success || !getProductResult.data) {
        throw new Error(`Error fetching product details: ${getProductResult.message}`);
    }

    const product = { ...getProductResult.data, productImageUrls: getProductResult.data.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url) => url !== null) as string[] };

    const getSellerResult = await handleGetSellerById(product.sellerId);
    if (!getSellerResult.success || !getSellerResult.data) {
        throw new Error(`Error fetching seller data: ${getSellerResult.message}`);
    }

    const seller = { ...getSellerResult.data, profilePictureUrl: normalizeHttpUrl(getSellerResult.data.profilePictureUrl) };

    const getAllCategoriesResult = await handleGetAllCategories();
    if (!getAllCategoriesResult.success || !getAllCategoriesResult.data) {
        throw new Error(`Error fetching categories data: ${getAllCategoriesResult.message}`);
    }

    const categories = getAllCategoriesResult.data.map((category) => (category)) || [];

    const getAllProductConditionsResult = await handleGetAllProductConditions();
    if (!getAllProductConditionsResult.success || !getAllProductConditionsResult.data) {
        throw new Error(`Error fetching product conditions data: ${getAllProductConditionsResult.message}`);
    }

    const productConditions = getAllProductConditionsResult.data.map((productCondition) => (productCondition)) || [];

    return (
        <>
            <ProductViewDetailsPublic currentUser={currentUser} product={product} seller={seller} categories={categories} productConditions={productConditions} />
        </>
    );
};

export default ProductViewDetailsPublicPage;