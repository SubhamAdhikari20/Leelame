// src/controllers/admin.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { AdminResponseDto, CreatedAdminDto, ForgotPasswordDto, ResetPasswordDto, SendEmailForRegistrationDto, VerifyOtpForRegistrationDto, VerifyOtpForResetPasswordDto } from "@/dtos/admin.dto.ts";
import { AdminService } from "@/services/admin.service.ts";
import { z } from "zod";
import { HttpError } from "@/errors/http-error.ts";


export class AdminController {
    private adminService: AdminService;

    constructor(adminService: AdminService) {
        this.adminService = adminService;
    }

    createAdmin = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = CreatedAdminDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.adminService.createAdmin(validatedData.data);

            const validatedResponseAdminData = AdminResponseDto.safeParse(result?.user);
            if (!validatedResponseAdminData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseAdminData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    token: result?.token,
                    user: validatedResponseAdminData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in admin signup controller:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message
                    },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                { status: 500 }
            );
        }
    };

    verifyOtpForRegistration = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = VerifyOtpForRegistrationDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.adminService.verifyOtpForRegistration(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in admin verify otp for registration controller:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message
                    },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                { status: 500 }
            );
        }
    };

    forgotPassword = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = ForgotPasswordDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: validatedData.error
                    },
                    { status: 400 }
                );
            }

            const result = await this.adminService.forgotPassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in admin forgot password controller:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message
                    },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                { status: 500 }
            );
        }
    };

    verifyOtpForResetPassword = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = VerifyOtpForResetPasswordDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: validatedData.error
                    },
                    { status: 400 }
                );
            }

            const result = await this.adminService.verifyOtpForResetpassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in admin verify otp for reset password controller:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message
                    },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                { status: 500 }
            );
        }
    };

    resetPassword = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = ResetPasswordDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: validatedData.error
                    },
                    { status: 400 }
                );
            }

            const result = await this.adminService.resetPassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in admin reset password controller:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message
                    },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                { status: 500 }
            );
        }
    };

    handleSendEmailForRegistration = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = SendEmailForRegistrationDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: validatedData.error
                    },
                    { status: 400 }
                );
            }

            const result = await this.adminService.handleSendEmailForRegistration(validatedData.data);

            const validatedResponseAdminData = AdminResponseDto.safeParse(result?.user);
            if (!validatedResponseAdminData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseAdminData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    user: validatedResponseAdminData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in admin send verication email controller:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message
                    },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                { status: 500 }
            );
        }
    };
}