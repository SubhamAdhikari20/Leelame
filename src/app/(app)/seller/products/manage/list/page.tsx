// src/app/(app)/seller/products/manage/list/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ListProducts from "@/components/seller/list-products.tsx";
import { handleGetCurrentSellerUser } from "@/lib/actions/seller/profile-details.action.ts";
import { handleGetAllProducts } from "@/lib/actions/product/product.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { normalizeHttpUrl } from "@/helpers/http-url.helper.ts";


const SellerManageProducts = async () => {
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

    return (
        <>
            <ListProducts currentUser={currentUser} products={products} categories={categories} />
        </>
    );
};

export default SellerManageProducts;