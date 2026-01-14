// src/controllers/buyer.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { BuyerResponseDto, CheckUsernameUniqueDto, CreatedBuyerDto, ForgotPasswordDto, ResetPasswordDto, SendEmailForRegistrationDto, VerifyOtpForRegistrationDto, VerifyOtpForResetPasswordDto } from "@/dtos/buyer.dto.ts";
import { BuyerService } from "@/services/buyer.service.ts";
import { z } from "zod";
import { HttpError } from "@/errors/http-error.ts";


export class BuyerController {
    private buyerService: BuyerService;

    constructor(buyerService: BuyerService) {
        this.buyerService = buyerService;
    }

    createBuyer = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = CreatedBuyerDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.buyerService.createBuyer(validatedData.data);

            const validatedResponseBuyerData = BuyerResponseDto.safeParse(result?.user);
            if (!validatedResponseBuyerData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseBuyerData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    token: result?.token,
                    user: validatedResponseBuyerData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in buyer signup controller:", error);

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

    checkUsernameUnique = async (req: NextRequest) => {
        try {
            const { searchParams } = new URL(req.url);
            const queryParam = {
                username: searchParams.get("username")
            };

            if (!queryParam) {
                return NextResponse.json(
                    { success: false, message: "Username query parameter is required" },
                    { status: 400 }
                );
            }

            const validatedData = CheckUsernameUniqueDto.safeParse(queryParam);

            if (!validatedData.success) {
                const formatted = z.treeifyError(validatedData.error);
                const usernameErrors = formatted.properties?.username?.errors || [];
                return NextResponse.json(
                    {
                        success: false,
                        message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
                    },
                    { status: 400 }
                );
                // return NextResponse.json({ success: false, message: z.prettifyError(validatedData.error) }, { status: 400 });
            }

            const result = await this.buyerService.checkUsernameUnique(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error checking username uniqueness controller: ", error);

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

            const result = await this.buyerService.verifyOtpForRegistration(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in buyer verify otp for registration controller:", error);

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
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.buyerService.forgotPassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in buyer forgot password controller:", error);

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
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.buyerService.verifyOtpForResetpassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in buyer verify otp for reset password controller:", error);

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
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.buyerService.resetPassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in buyer reset password controller:", error);

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
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.buyerService.handleSendEmailForRegistration(validatedData.data);

            const validatedResponseBuyerData = BuyerResponseDto.safeParse(result?.user);
            if (!validatedResponseBuyerData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseBuyerData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    user: validatedResponseBuyerData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in buyer send verication email controller:", error);

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