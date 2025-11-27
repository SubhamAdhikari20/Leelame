// src/controllers/buyer.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { CreatedBuyerDto } from "@/dtos/buyer.dto.ts";
import { BuyerService } from "@/services/buyer.service.ts";
import { BuyerRepositoryInterface } from "@/interfaces/buyer.repository.interface.ts";
import { UserRepositoryInterface } from "@/interfaces/user.repository.interface.ts";


export class BuyerController {
    private buyerRepo: BuyerRepositoryInterface;
    private userRepo: UserRepositoryInterface;
    private buyerService: BuyerService;

    constructor(userRepo: UserRepositoryInterface, buyerRepo: BuyerRepositoryInterface) {
        this.buyerRepo = buyerRepo;
        this.userRepo = userRepo;
        this.buyerService = new BuyerService(this.buyerRepo, this.userRepo);
    }

    createBuyer = async (req: NextRequest) => {
        try {
            const body = await req.json();
            const validatedData = CreatedBuyerDto.parse(body);
            const result = await this.buyerService.createBuyer(validatedData);
            return NextResponse.json({
                success: result?.success,
                message: result?.message,
                token: result?.token,
                user: result?.user,
            }, { status: result?.status ?? 400 });
        }
        catch (error: any) {
            console.error("Error in buyer signup controller:", error);
            return NextResponse.json({
                success: false,
                message: error.message ?? "Internal Server Error"
            },
                { status: 500 }
            );
        }
    };
}