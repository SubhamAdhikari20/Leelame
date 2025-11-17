// src/app/api/users/buyer/send-account-registration-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import User, { IUserPopulated } from "@/models/user.model.ts";
import { sendVerificationEmail } from "@/helpers/send-registration-verification-email.ts";


export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ message: "Email required" }, { status: 400 });
        }

        const decodedEmail = decodeURIComponent(email);

        const user = await User.findOne({ email: decodedEmail }).populate<IUserPopulated>("buyerProfile");;

        if (!user) {
            return NextResponse.json({ message: "User with email not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json(
                { success: false, message: "This account is already verified. Please login." },
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

        // generate 6‑digit OTP & expiry
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);    // Add 10 mins from 'now'

        user.isVerified = false;
        user.verifyCode = otp;
        user.verifyCodeExpiryDate = expiryDate;
        await user.save();

        const emailNextResponse = await sendVerificationEmail(buyerProfile.fullName, email, otp);
        if (!emailNextResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: `${emailNextResponse.message ?? "Failed to send verification email. Try again later."}`
                }, { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `${emailNextResponse.message ?? "Verification email sent successfully. Please check your inbox."}`,
                user: user
            }, { status: 200 }
        );
    }
    catch (error: any) {
        console.error("Error sending account verification email: ", error);
        return NextResponse.json(
            {
                success: false,
                message: `${error.toString() ?? error.message ?? "Internal Server Error"}`
            }, { status: 500 }
        );
    }
};