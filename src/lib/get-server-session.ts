// src/lib/get-server-session.ts
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options.ts";


export const getCurrentServerSession = async (): Promise<ServerSessionResponseType> => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        const response: ServerSessionResponseType = {
            success: false,
            message: "Session Error! Session does not exist with stored user.",
        }
        return response;
    }

    const response: ServerSessionResponseType = {
        success: true,
        message: "Session fetched successfully.",
        session: session
    }
    return response;
};

export type ServerSessionResponseType = {
    success: boolean;
    message: string;
    session?: Session | null;
};