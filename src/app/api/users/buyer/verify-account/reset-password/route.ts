// src/app/api/users/buyer/verify-account/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import User, { IUserPopulated } from "@/models/user.model.ts";
import Buyer, { IBuyerPopulated } from "@/models/buyer.model.ts";
// import User from "@/models/user.model.ts";


export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const { email, code } = await req.json();

        if (!email || email.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        if (!code || code.trim() === "") {
            return NextResponse.json(
                { success: false, message: "OTP is required" },
                { status: 400 }
            );
        }

        const decodedEmail = decodeURIComponent(email);

        const user = await User.findOne({ email: decodedEmail }).populate<IUserPopulated>("buyerProfile");
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found for this email address!" },
                { status: 404 }
            );
        }

        if (!user.verifyEmailResetPassword || !user.verifyEmailResetPasswordExpiryDate) {
            return NextResponse.json(
                { success: false, message: "No OTP request found. Please request for a new OTP." },
                { status: 400 }
            );
        }

        if (user.verifyEmailResetPassword !== code) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP. Please try again." },
                { status: 400 }
            );
        }

        if (new Date() > new Date(user.verifyEmailResetPasswordExpiryDate)) {
            return NextResponse.json(
                { success: false, message: "OTP has expired. Please request for a new OTP." },
                { status: 400 }
            );
        }

        // user.verifyEmailResetPassword = null;
        // user.verifyEmailResetPasswordExpiryDate = null;
        // await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Account verified successfully. You can reset password.",
                user: user
            },
            { status: 200 }
        );
    }
    catch (error: any) {
        console.error("Error verifying OTP for user registration: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            },
            { status: 500 }
        );
    }
};