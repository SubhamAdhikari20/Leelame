// src/app/api/users/buyer/get-current-user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/config/db.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { BuyerService } from "@/services/buyer.service.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerService = new BuyerService(userRepo, buyerRepo);
        const buyerController = new BuyerController(buyerService);

        return await buyerController.getCurrentBuyerUser(req, context);
    }
    catch (error: Error | any) {
        console.error("Error fetching current buyer route: ", error);

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