// src/lib/cookie.ts
"use server";
import { cookies } from "next/headers";


type UserRole = "buyer" | "seller" | "admin";

export type UserData = {
    _id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    baseUserId: string;
    fullName?: string | null;
    username?: string | null;
    contact?: string | null;
    [key: string]: any;
}

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "auth_token",
        value: token,
        maxAge: 60 * 60 * 24, // 1 day
    })
};

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value || null;
};

export const setUserData = async (userData: UserData) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "user_data",
        value: JSON.stringify(userData),
    })
};

export const getUserData = async (): Promise<UserData | null> => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value || null;
    return userData ? JSON.parse(userData) : null;
};

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
};