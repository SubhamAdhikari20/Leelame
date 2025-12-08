// src/api/users/buyer/check-username-unique/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { BuyerRepository } from "@/repositories/buyer.repository.ts";
import { BuyerController } from "@/controllers/buyer.controller.ts";

export const GET = async (req: NextRequest) => {
    try {
        await dbConnect();

        const userRepo = new UserRepository();
        const buyerRepo = new BuyerRepository();
        const buyerController = new BuyerController(userRepo, buyerRepo);
        return await buyerController.checkUsernameUnique(req);        
    }
    catch (error: any) {
        console.error("Error checking username uniqueness route: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            },
            { status: 500 }
        );
    }
};