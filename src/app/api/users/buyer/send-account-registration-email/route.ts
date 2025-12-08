// src/app/api/users/buyer/send-account-registration-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerController = new BuyerController(userRepo, buyerRepo);
        return await buyerController.handleSendEmailForRegistration(req); 
    }
    catch (error: any) {
        console.error("Error sending account verification email route: ", error);
        return NextResponse.json(
            {
                success: false,
                message: error.toString() ?? error.message ?? "Internal Server Error"
            }, { status: 500 }
        );
    }
};