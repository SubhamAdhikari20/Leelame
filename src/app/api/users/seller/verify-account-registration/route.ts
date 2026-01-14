// src/app/api/users/seller/verify-account-registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/config/db.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { SellerRepository } from "@/repositories/seller.repository.ts";
import { SellerService } from "@/services/seller.service.ts";
import { SellerController } from "@/controllers/seller.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const sellerRepo = new SellerRepository();
        const sellerService = new SellerService(userRepo, sellerRepo);
        const sellerController = new SellerController(sellerService);

        return await sellerController.verifyOtpForRegistration(req);
    }
    catch (error: Error | any) {
        console.error("Error verifying OTP for seller registration route: ", error);

        if (error instanceof HttpError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message
                },
                { status: error.status }
            );
        }

        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
};