// src/types/current-user.ts

type UserRole = "buyer" | "seller" | "admin";

export type CurrentUserType = {
    _id: string;
    email: string;
    role: UserRole | string;
    isVerified: boolean;
    baseUserId: string;
    fullName?: string | null;
    username?: string | null;
    contact?: string | null;
    profilePictureUrl?: string | null;
    bio?: string | null;
    isPermanentlyBanned?: boolean | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export type CurrentUserPropsType = {
    currentUser?: CurrentUserType | null;
};

export type CurrentUserResponseType = {
    success: boolean;
    message: string;
    user?: CurrentUserType | null;
};