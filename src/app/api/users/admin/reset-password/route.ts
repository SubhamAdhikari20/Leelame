// src/app/api/users/admin/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { AdminRepository } from "@/repositories/admin.repository.ts";
import { AdminController } from "@/controllers/admin.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const adminRepo = new AdminRepository();
        const adminController = new AdminController(userRepo, adminRepo);
        return await adminController.resetPassword(req);
    }
    catch (error: any) {
        console.error("Error resetting password in admin route: ", error);

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