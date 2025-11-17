// src/app/api/users/buyer/verify-account/registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db-connect.ts";
import Buyer, { IBuyerPopulated } from "@/models/buyer.model.ts";
// import User from "@/models/user.model.ts";


export const PUT = async (req: NextRequest) => {
    try {
        await dbConnection();

        const { username, code } = await req.json();

        if (!username || username.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Username is required" },
                { status: 400 }
            );
        }

        if (!code || code.trim() === "") {
            return NextResponse.json(
                { success: false, message: "OTP is required" },
                { status: 400 }
            );
        }

        const decodedUsername = decodeURIComponent(username);

        // Buyer user
        const buyerProfile = await Buyer.findOne({ username: decodedUsername }).populate<IBuyerPopulated>("userId");

        if (!buyerProfile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Buyer user with this username not found."
                },
                { status: 404 }
            );
        }

        // User from base user
        const user = buyerProfile.userId;

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { success: false, message: "This account is already verified. Please login." },
                { status: 400 }
            );
        }

        if (!user.verifyCode || !user.verifyCodeExpiryDate) {
            return NextResponse.json(
                { success: false, message: "No OTP request found. Please request for a new OTP." },
                { status: 400 }
            );
        }

        if (user.verifyCode !== code) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP. Please try again." },
                { status: 400 }
            );
        }

        if (new Date() > new Date(user.verifyCodeExpiryDate)) {
            return NextResponse.json(
                { success: false, message: "OTP has expired. Please request for a new OTP." },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyCode = null;
        user.verifyCodeExpiryDate = null;
        await user.save();

        // const updatedUser = await User.findByIdAndUpdate(user._id, {
        //     isVerified: true,
        //     verifyCode: null,
        //     verifyCodeExpiryDate: null,
        // }, { new: true });

        // await buyerProfile.save();
        // // Link buyerProfile to user
        // if (updatedUser) {
        //     updatedUser.buyerProfile = buyerProfile._id as mongoose.Types.ObjectId;
        //     await updatedUser.save();
        // }

        return NextResponse.json(
            {
                success: true,
                message: "Account verified successfully. You can now login.",
                user: { ...user, buyerProfile: buyerProfile }
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