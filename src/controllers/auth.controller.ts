// src/controllers/auth.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { LoginUserDto, AuthResponseDto } from "@/dtos/auth.dto.ts";
import { AuthService } from "@/services/auth.service.ts";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { SellerRepositoryInterface } from "@/interfaces/seller.repository.interface.ts";
import { AdminRepositoryInterface } from "@/interfaces/admin.repository.interface.ts";
import { z } from "zod";
import { HttpError } from "@/errors/http-error.ts";


export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    authenticate = async (req: NextRequest) => {
        try {
            const body = req.json();
            const validatedData = LoginUserDto.safeParse(body);

            if (!validatedData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedData.error)
                    },
                    { status: 400 }
                );
            }

            const result = await this.authService.authenticate(validatedData.data);

            const validatedResponseAuthData = AuthResponseDto.safeParse(result?.user);
            if (!validatedResponseAuthData.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: z.prettifyError(validatedResponseAuthData.error)
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    message: result?.message,
                    user: validatedResponseAuthData.data,
                    // user: result?.user,
                },
                { status: result?.status ?? 200 }
            );
        }
        catch (error) {
            console.error("Error in login auth controller:", error);

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