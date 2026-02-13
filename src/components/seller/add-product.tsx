// src/components/product/add-product.tsx
import React from "react";
import { Button } from "@/components/ui/button.tsx";
import type { CurrentUserPropsType } from "@/types/current-user.type.ts";


const AddProduct = ({ currentUser }: CurrentUserPropsType) => {
    return (
        <section className="p-4 md:p-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Add Product</h1>
        </section>
    );
};

export default AddProduct;