// src/lib/get-server-session.ts
import type { UserData } from "./cookie.ts";
import { getAuthToken, getUserData } from "./cookie.ts";


export const getServerSession = async (): Promise<ServerSessionResponseType> => {
    const token = await getAuthToken();
    const userData = await getUserData();

    if (!token || !userData) {
        const response: ServerSessionResponseType = {
            success: false,
            message: "Session Error! Session does not exist with stored user.",
        }
        return response;
    }

    const response: ServerSessionResponseType = {
        success: true,
        message: "Session fetched successfully.",
        token: token,
        data: userData
    }
    return response;
};

export type ServerSessionResponseType = {
    success: boolean;
    message: string;
    token?: string | null;
    data?: UserData | null;
};