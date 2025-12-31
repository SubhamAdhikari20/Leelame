// src/app/api/users/buyer/verify-account/registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerController = new BuyerController(userRepo, buyerRepo);
        return await buyerController.verifyOtpForRegistration(req);
    }
    catch (error: any) {
        console.error("Error verifying OTP for user registration route: ", error);

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