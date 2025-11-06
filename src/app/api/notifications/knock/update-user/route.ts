// src/app/api/notifications/knock/update-user/route.ts
import { NextResponse, NextRequest } from "next/server";
import knock from "@/lib/knock.ts";
import User from "@/models/user.model.ts";

export const POST = async (request: NextRequest) => {
    try {
        const { userId, fullName, email } = await request.json();

        if (!userId || !email) {
            return NextResponse.json(
                { success: false, message: "userId and email are required" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" } ,{status: 404});
        }

        await knock.users.update(userId, {
            id: userId,
            name: fullName || "User",
            email: email,
            channels: {
                email: email,
                in_app: { [process.env.NEXT_PUBLIC_KNOCK_PUBLIC_FEED_ID!]: {} },
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error updating Knock user:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update user in Knock" },
            { status: 500 }
        );
    }
};