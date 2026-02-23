// src/app/(app)/(public)/products/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ProductListing from "@/components/common/product-listing.tsx";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { handleGetAllProducts } from "@/lib/actions/product/product.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { handleGetAllSellers } from "@/lib/actions/seller/profile-details.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";
import type { CurrentUserType } from "@/types/current-user.type.ts";


const ProductPage = async () => {
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

    const getAllProductsResult = await handleGetAllProducts();
    if (!getAllProductsResult.success) {
        throw new Error(`Error fetching products data: ${getAllProductsResult.message}`);
    }

    const products = getAllProductsResult.data?.map((product) => ({
        ...product,
        productImageUrls: product.productImageUrls.map((productImageUrl) => normalizeHttpUrl(productImageUrl)).filter((url) => url !== null) as string[],
    })) || [];

    const getAllCategoriesResult = await handleGetAllCategories();
    if (!getAllCategoriesResult.success) {
        throw new Error(`Error fetching categories data: ${getAllCategoriesResult.message}`);
    }

    const categories = getAllCategoriesResult.data?.map((category) => (category)) || [];

    const getAllSellersResult = await handleGetAllSellers();
    if (!getAllSellersResult.success) {
        throw new Error(`Error fetching user data: ${getAllSellersResult.message}`);
    }

    const sellers = getAllSellersResult.data?.map((seller) => ({
        ...seller,
        profilePictureUrl: normalizeHttpUrl(seller.profilePictureUrl),
    })) || [];

    const getAllProductConditionsResult = await handleGetAllProductConditions();
    if (!getAllProductConditionsResult.success) {
        throw new Error(`Error fetching product conditions data: ${getAllProductConditionsResult.message}`);
    }

    const productConditions = getAllProductConditionsResult.data?.map((productCondition) => (productCondition)) || [];

    return (
        <>
            <ProductListing currentUser={currentUser} products={products} categories={categories} sellers={sellers} productConditions={productConditions} />
        </>
    );
};

export default ProductPage;