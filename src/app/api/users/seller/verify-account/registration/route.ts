// src/app/api/users/seller/verify-account/registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { SellerRepository } from "@/repositories/seller.repository.ts";
import { SellerController } from "@/controllers/seller.controller.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const sellerRepo = new SellerRepository();
        const sellerController = new SellerController(userRepo, sellerRepo);
        return await sellerController.verifyOtpForRegistration(req);
    }
    catch (error: any) {
        console.error("Error verifying OTP for user registration: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            },
            { status: 500 }
        );
    }
};