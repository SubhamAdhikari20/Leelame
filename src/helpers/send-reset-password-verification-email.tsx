// src/helpers/send-reset-password-verification-email.tsx
import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { ApiResponse } from "@/types/api-response.ts";
import ResetPasswordVerificationEmail from "@/emails/reset-password-verification-email.tsx";


export const sendResetPasswordVerificationEmail = async (
    fullName: string,
    email: string,
    otp: string
): Promise<ApiResponse> => {
    try {
        const html = await render(
            <ResetPasswordVerificationEmail fullName={fullName} email={email} otp={otp} />
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            // host: "smtp.gmail.com",
            // port: 587, // or 465
            // secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 3) Send the email
        await transporter.sendMail({
            from: `"Leelame" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Leelame | Verification Code for reseting password",
            html,
        });

        return {
            success: true,
            message: "Verification email for reseting password sent  successfully",
        };
    }
    catch (error) {
        console.log("Error sending verification for reseting password email: ", error);

        return {
            success: false,
            message: "Failed to send verification for reseting password email",
        };
    }
};