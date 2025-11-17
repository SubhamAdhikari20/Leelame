// src/app/api/users/buyer/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import bcrypt from "bcryptjs";
import User, { IUserPopulated } from "@/models/user.model.ts";


export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const { email, newPassword } = await req.json();

        if (!email || email.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        if (!newPassword || newPassword.trim() === "") {
            return NextResponse.json(
                { success: false, message: "New password is required" },
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
                {
                    success: false,
                    message: "No OTP request found. Please request a new OTP."
                },
                { status: 400 }
            );
        }

        if (new Date() > new Date(user.verifyEmailResetPasswordExpiryDate)) {
            return NextResponse.json(
                { success: false, message: "OTP has expired. Request a new one." },
                { status: 400 }
            );
        }

        const buyerProfile = user.buyerProfile;

        if (!buyerProfile) {
            return NextResponse.json(
                { success: false, message: "Buyer user not found for this email address!" },
                { status: 404 }
            );
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        buyerProfile.password = hashedPassword;
        user.verifyEmailResetPassword = null;
        user.verifyEmailResetPasswordExpiryDate = null;

        await buyerProfile.save();
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Password has been reset successfully.",
                user: user
            },
            { status: 200 }
        );
    }
    catch (error: any) {
        console.error("Error resetting password: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            },
            { status: 500 }
        );
    }
};