// src/app/(app)/admin/products/view-details/[productId]/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ProductViewDetails from "@/components/admin/product-view-details.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetProductById } from "@/lib/actions/product/product.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";
import { handleGetSellerById } from "@/lib/actions/seller/profile-details.action.ts";


const ProductViewDetailsPage = async ({ params }: { params: { productId: string } }) => {
    const { productId } = await params;

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

    const currentUser = getCurrentUserResult.data;

    const getProductResult = await handleGetProductById(productId);
    if (!getProductResult.success || !getProductResult.data) {
        throw new Error(`Error fetching product details: ${getProductResult.message}`);
    }

    const product = getProductResult.data;

    const getAllCategoriesResult = await handleGetAllCategories();
    if (!getAllCategoriesResult.success || !getAllCategoriesResult.data) {
        throw new Error(`Error fetching categories data: ${getAllCategoriesResult.message}`);
    }

    const categories = getAllCategoriesResult.data;

    const getAllProductConditionsResult = await handleGetAllProductConditions();
    if (!getAllProductConditionsResult.success || !getAllProductConditionsResult.data) {
        throw new Error(`Error fetching product conditions data: ${getAllProductConditionsResult.message}`);
    }

    const productConditions = getAllProductConditionsResult.data;

    const getSellerResult = await handleGetSellerById(product.sellerId);
    if (!getSellerResult.success || !getSellerResult.data) {
        throw new Error(`Error fetching seller details: ${getSellerResult.message}`);
    }

    const seller = getSellerResult.data;

    return (
        <>
            <ProductViewDetails currentUser={currentUser} product={product} categories={categories} productConditions={productConditions} seller={seller} />
        </>
    );
};

export default ProductViewDetailsPage;