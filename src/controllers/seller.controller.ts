// src/controllers/seller.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { SellerResponseDto, CreatedSellerDto, VerifyOtpForRegistrationDto, ForgotPasswordDto, ResetPasswordDto, SendEmailForRegistrationDto, UpdateSellerProfileDetailsDto } from "@/dtos/seller.dto.ts";
import { SellerService } from "@/services/seller.service.ts";
import { z } from "zod";
import { HttpError } from "@/errors/http-error.ts";


export class SellerController {
    private sellerService: SellerService;

    constructor(sellerService: SellerService) {
        this.sellerService = sellerService;
    }

    createSeller = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = CreatedSellerDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.sellerService.createSeller(validatedData.data);

            const validatedResponseSellerData = SellerResponseDto.safeParse(result?.user);
            if (!validatedResponseSellerData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseSellerData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    token: result?.token,
                    user: validatedResponseSellerData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in seller signup controller: ", error);

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

            const result = await this.sellerService.verifyOtpForRegistration(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error verifying otp for registration for seller controller: ", error);

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

            const result = await this.sellerService.forgotPassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error in seller forgot password controller: ", error);

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

            const result = await this.sellerService.resetPassword(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error reseting password for seller controller: ", error);

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

            const result = await this.sellerService.handleSendEmailForRegistration(validatedData.data);

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error sending verication email for seller controller: ", error);

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

    getCurrentSellerUser = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
            const { id } = await params;

            const result = await this.sellerService.getCurrentSellerUser(id);
            const validatedResponseSellerData = SellerResponseDto.safeParse(result?.user);
            if (!validatedResponseSellerData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseSellerData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    user: validatedResponseSellerData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error fetching current seller controller: ", error);

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

    updateSellerProfileDetails = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = UpdateSellerProfileDetailsDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.sellerService.updateSellerProfileDetails("", validatedData.data);
            const validatedResponseSellerData = SellerResponseDto.safeParse(result?.user);
            if (!validatedResponseSellerData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseSellerData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: result?.success,
                    message: result?.message,
                    user: validatedResponseSellerData.data,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error: Error | any) {
            console.error("Error sending verication email for seller controller: ", error);

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