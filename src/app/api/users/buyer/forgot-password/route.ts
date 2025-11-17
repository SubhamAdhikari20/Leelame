// src/app/api/users/buyer/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import User, { IUserPopulated } from "@/models/user.model.ts";
import { sendResetPasswordVerificationEmail } from "@/helpers/send-reset-password-verification-email.tsx";


export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const { email } = await req.json();

        if (!email || email.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        const decodedEmail = decodeURIComponent(email);

        const user = await User.findOne({ email: decodedEmail }).populate<IUserPopulated>("buyerProfile");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email address. User not availabale!" },
                { status: 404 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { success: false, message: "This account is not verified. Please verify your email first." },
                { status: 400 }
            );
        }

        const buyerProfile = user.buyerProfile;

        if (!buyerProfile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Buyer user not found."
                },
                { status: 404 }
            );
        }

        // send verfication email for reseting password
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);    // Add 10 mins from 'now'

        user.verifyEmailResetPassword = otp;
        user.verifyEmailResetPasswordExpiryDate = expiryDate;
        await user.save();

        // const updatedUser = await User.findByIdAndUpdate(user._id, {
        //     verifyEmailResetPassword: otp,
        //     verifyEmailResetPasswordExpiryDate: expiryDate
        // }, { new: true });

        const emailResponse = await sendResetPasswordVerificationEmail(
            buyerProfile.fullName,
            email,
            otp
        );

        if (!emailResponse.success) {
            return NextResponse.json(
                { success: false, message: `${emailResponse.message ?? "Failed to send verification email"}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Reset Password instructions have been sent to your email",
                user: user
            },
            { status: 201 }
        );
    }
    catch (error: any) {
        console.error("Error in forgot password: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            },
            { status: 500 }
        );
    }
};