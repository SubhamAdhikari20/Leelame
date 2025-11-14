// src/api/users/buyer/check-username-unique/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db-connect.ts";
import User from "@/models/user.model.ts";
import Buyer from "@/models/buyer.model.ts";
import { usernameQuerySchema } from "@/schemas/auth/sign-up-schema.ts";


export const GET = async (req: NextRequest) => {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username")
        };

        const result = usernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const formatted = z.treeifyError(result.error);
            const usernameErrors = formatted.properties?.username?.errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
                },
                { status: 400 }
            );
        }

        const { username: validatedUsername } = result.data;

        const existingVerifiedUser = await Buyer.findOne({ username: validatedUsername });

        if (existingVerifiedUser) {
            const linkedUser = await User.findOne({ _id: existingVerifiedUser.userId });

            if (linkedUser?.isVerified === true) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Username is already taken!"
                    },
                    { status: 400 }
                );
            }
        }
        return NextResponse.json(
            {
                success: true,
                message: "Username is available"
            },
            { status: 200 }
        );
    }
    catch (error: any) {
        console.error("Error checking username uniqueness:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error"
            },
            { status: 500 }
        );
    }
};