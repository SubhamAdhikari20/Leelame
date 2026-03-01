// src/app/(app)/admin/products/list/error.tsx
import React from "react";
import { getServerSession } from "@/lib/get-server-session.ts";
import { notFound, redirect } from "next/navigation";
import ListProducts from "@/components/admin/list-products.tsx";
import { handleGetCurrentAdminUser } from "@/lib/actions/admin/profile-details.action.ts";
import { handleGetAllProducts } from "@/lib/actions/product/product.action.ts";
import { handleGetAllCategories } from "@/lib/actions/category/category.action.ts";
import { handleGetAllProductConditions } from "@/lib/actions/product-condition/condition.action.ts";


const AdminManageProducts = async () => {
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

    const getAllProductsResult = await handleGetAllProducts();
    if (!getAllProductsResult.success || !getAllProductsResult.data) {
        throw new Error(`Error fetching products data: ${getAllProductsResult.message}`);
    }

    const products = getAllProductsResult.data;

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

    return (
        <>
            <ListProducts currentUser={currentUser} products={products} categories={categories} productConditions={productConditions} />
        </>
    );
};

export default AdminManageProducts;