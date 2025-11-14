// src/helpers/send-verification-email.tsx
import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { ApiResponse } from "@/types/api-response.ts";
import RegistrationVerificationEmail from "@/emails/registration-verification-email.tsx";


export const sendVerificationEmail = async (
    fullName: string,
    email: string,
    otp: string
): Promise<ApiResponse> => {
    try {
        const html = await render(
            <RegistrationVerificationEmail fullName={fullName} otp={otp} />
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

        await transporter.sendMail({
            from: `"Leelame" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Leelame | Your Verification Code",
            html
        });

        return {
            success: true,
            message: "Verification email sent  successfully."
        };
    }
    catch (error) {
        console.log("Error sending verification email: ", error);

        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
};