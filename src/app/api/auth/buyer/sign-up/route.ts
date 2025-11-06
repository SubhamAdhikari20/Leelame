// src/app/api/auth/buyer/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnection from "@/lib/db-connect.ts";
import User from "@/models/user.model.ts";
import Buyer from "@/models/buyer.model.ts";
import { sendVerificationEmail } from "@/helpers/send-verification-email.ts";


export const POST = async (req: NextRequest) => {
    try {
        await dbConnection();

        const { fullName, email, username, contact, password, terms, role } = await req.json();

        // Check existing user
        const existingUserByEmail = await User.findOne({ email });

        // Check for existing username
        const existingBuyerByUsername = await Buyer.findOne({ username });
        if (
            existingBuyerByUsername &&
            existingUserByEmail?.isVerified === true
        ) {
            return NextResponse.json({ success: true, message: "Username already exists" }, { status: 400 });
        }

        // Check for existing contact number
        const existingBuyerByContact = await Buyer.findOne({ contact });
        if (existingBuyerByContact && existingUserByEmail?.isVerified === true) {
            return NextResponse.json({ success: false, message: "Contact already exists" }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10); // Add 10 mins from 'now'

        let newUser;
        let buyerProfile;
        let isNewUserCreated = false;

        // Check for existing email
        if (existingUserByEmail) {
            if (existingUserByEmail?.isVerified) {
                return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
            }

            // Update existing unverified user
            existingUserByEmail.verifyCode = otp;
            existingUserByEmail.verifyCodeExpiryDate = expiryDate;
            existingUserByEmail.role = role;
            await existingUserByEmail.save();
            newUser = existingUserByEmail;

            // If buyerProfile does not exist for this user, create one
            buyerProfile = await Buyer.findOne({ userId: newUser._id });
            if (!buyerProfile) {
                buyerProfile = new Buyer({
                    userId: newUser._id,
                    fullName,
                    username,
                    contact,
                    password: hashedPassword,
                    terms,
                });
            }
            else {
                // Update if exists
                buyerProfile.fullName = fullName;
                buyerProfile.username = username;
                buyerProfile.contact = contact;
                buyerProfile.password = hashedPassword;
                buyerProfile.terms = terms;
                await buyerProfile.save();
            }
        }
        else {
            // Create new user
            newUser = new User({
                email,
                role: "buyer",
                isVerified: false,
                verifyCode: otp,
                verifyCodeExpiryDate: expiryDate,
            });

            // Create buyer profile
            buyerProfile = new Buyer({
                userId: newUser._id,
                fullName,
                username,
                contact,
                password: hashedPassword,
                terms,
            });
            isNewUserCreated = true;
        }

        // JWT Expiry Calculation in seconds for Signup Token
        const secondsInAYear = 365 * 24 * 60 * 60;
        const expiresInSeconds = Number(process.env.JWT_SIGNUP_EXPIRES_IN) * secondsInAYear;

        // Generate Token
        const token = jwt.sign(
            { _id: newUser._id, email: newUser.email, username: buyerProfile.username, role: newUser.role },
            process.env.JWT_SECRET!,
            { expiresIn: expiresInSeconds }
        );

        // Send verification email
        const emailResponse = await sendVerificationEmail(fullName, email, otp);
        if (!emailResponse.success) {
            // Rollback user creation if email sending fails
            if (isNewUserCreated) {
                await User.findByIdAndDelete(newUser._id);
                await Buyer.findByIdAndDelete(buyerProfile._id);
            }
            else {
                // If it was an existing unverified user, clear verification fields
                newUser.verifyCode = null;
                newUser.verifyCodeExpiryDate = null;
                
                await newUser.save();
                await buyerProfile.save();
            }

            return NextResponse.json({ success: false, message: "Failed to send verification email" }, { status: 500 });
        }

        await buyerProfile.save();
        // Link buyerProfile to user
        newUser.buyerProfile = buyerProfile._id as mongoose.Types.ObjectId;
        await newUser.save();

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            token,
            user: { ...newUser, buyerProfile: buyerProfile }
        }, { status: 201 });

    }
    catch (error: any) {
        console.error("Error in buyer signup:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
};