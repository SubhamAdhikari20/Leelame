// src/app/api/users/buyer/send-account-registration-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/config/db.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { BuyerService } from "@/services/buyer.service.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerService = new BuyerService(userRepo, buyerRepo);
        const buyerController = new BuyerController(buyerService);

        return await buyerController.handleSendEmailForRegistration(req);
    }
    catch (error: Error | any) {
        console.error("Error sending account verification email buyer route: ", error);

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