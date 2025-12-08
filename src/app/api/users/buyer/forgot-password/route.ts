// src/app/api/users/buyer/forgot-password/route.ts
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
        return await buyerController.forgotPassword(req);
    }
    catch (error: any) {
        console.error("Error in forgot password: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            },
            { status: 500 }
        );
    }
};