// src/app/(app)/(buyer)/[username]/my-bids/page.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import MyBids from "@/components/buyer/my-bids.tsx";
import { handleGetCurrentBuyerUser } from "@/lib/actions/buyer/profile-details.action.ts";
import { handleGetAllBidsByBuyerId } from "@/lib/actions/bid/bid.action.ts";
import { handleGetAllVerifiedProducts } from "@/lib/actions/product/product.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { handleGetAllSellers } from "@/lib/actions/seller/profile-details.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";


const MyBidsPage = async () => {
    const response = await getServerSession();

    if (!response.success) {
        throw new Error(response.message ?? "Unknown");
    }

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

    const currentUser = getCurrentUserResult.data;

    const getAllProductsResult = await handleGetAllVerifiedProducts();
    if (!getAllProductsResult.success || !getAllProductsResult.data) {
        throw new Error(`Error fetching products data: ${getAllProductsResult.message}`);
    }

    const products = getAllProductsResult.data.map((product) => {
        if (!product.isSoldOut) {
            return product;
        }
    }).filter((product) => product !== undefined);

    const getAllCategoriesResult = await handleGetAllCategories();
    if (!getAllCategoriesResult.success || !getAllCategoriesResult.data) {
        throw new Error(`Error fetching categories data: ${getAllCategoriesResult.message}`);
    }

    const categories = getAllCategoriesResult.data;

    const getAllSellersResult = await handleGetAllSellers();
    if (!getAllSellersResult.success || !getAllSellersResult.data) {
        throw new Error(`Error fetching user data: ${getAllSellersResult.message}`);
    }

    const sellers = getAllSellersResult.data;

    const getAllProductConditionsResult = await handleGetAllProductConditions();
    if (!getAllProductConditionsResult.success || !getAllProductConditionsResult.data) {
        throw new Error(`Error fetching product conditions data: ${getAllProductConditionsResult.message}`);
    }

    const productConditions = getAllProductConditionsResult.data;

    const getAllBidsResult = await handleGetAllBidsByBuyerId(currentUser._id);
    if (!getAllBidsResult.success || !getAllBidsResult.data) {
        throw new Error(`Error fetching bids data: ${getAllBidsResult.message}`);
    }

    const bids = getAllBidsResult.data;

    return (
        <>
            <MyBids currentUser={currentUser} products={products} categories={categories} sellers={sellers} productConditions={productConditions} bids={bids} />
        </>
    );
};

export default MyBidsPage;