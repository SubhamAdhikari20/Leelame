// src/app/api/users/admin/send-account-registration-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/config/db.ts";
import { UserRepository } from "@/repositories/user.repository.ts";
import { AdminRepository } from "@/repositories/admin.repository.ts";
import { AdminService } from "@/services/admin.service.ts";
import { AdminController } from "@/controllers/admin.controller.ts";
import { HttpError } from "@/errors/http-error.ts";

export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const userRepo = new UserRepository();
        const adminRepo = new AdminRepository();
        const adminService = new AdminService(userRepo, adminRepo);
        const adminController = new AdminController(adminService);

        return await adminController.handleSendEmailForRegistration(req);
    }
    catch (error: Error | any) {
        console.error("Error sending account verification email admin route: ", error);

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