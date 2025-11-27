// src/app/api/users/buyer/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";

export const POST = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerController = new BuyerController(userRepo, buyerRepo);
        return await buyerController.createBuyer(req);
    }
    catch (error: any) {
        console.error("Error in buyer signup route:", error);
        return NextResponse.json({
            success: false,
            message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
        }, { status: 500 });
    }
};