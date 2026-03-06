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
import { handleGetAllBidsByProductId } from "@/lib/actions/bid/bid.action.ts";
import { handleGetAllBuyers } from "@/lib/actions/buyer/buyer.action.ts";
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

        currentUser = getCurrentUserResult.data;
    }

    const getProductResult = await handleGetProductById(productId);
    if (!getProductResult.success || !getProductResult.data) {
        throw new Error(`Error fetching product details: ${getProductResult.message}`);
    }

    const product = getProductResult.data;

    const getSellerResult = await handleGetSellerById(product.sellerId);
    if (!getSellerResult.success || !getSellerResult.data) {
        throw new Error(`Error fetching seller data: ${getSellerResult.message}`);
    }

    const seller = getSellerResult.data;

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

    const getAllBiddersResult = await handleGetAllBidsByProductId(productId);
    if (!getAllBiddersResult.success || !getAllBiddersResult.data) {
        throw new Error(`Error fetching bidders data: ${getAllBiddersResult.message}`);
    }

    const bids = getAllBiddersResult.data;

    const getAllBuyers = await handleGetAllBuyers();
    if (!getAllBuyers.success || !getAllBuyers.data) {
        throw new Error(`Error fetching bidders data: ${getAllBuyers.message}`);
    }

    const buyers = getAllBuyers.data;

    return (
        <>
            <ProductViewDetailsPublic currentUser={currentUser} product={product} seller={seller} categories={categories} productConditions={productConditions} bids={bids} bidders={buyers} />
        </>
    );
};

export default ProductViewDetailsPublicPage;