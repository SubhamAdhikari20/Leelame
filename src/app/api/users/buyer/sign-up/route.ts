// src/app/api/users/buyer/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/config/db";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { BuyerService } from "@/services/buyer.service.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const POST = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerService = new BuyerService(userRepo, buyerRepo);
        const buyerController = new BuyerController(buyerService);

        return await buyerController.createBuyer(req);
    }
    catch (error: any) {
        console.error("Error in buyer signup route:", error);

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