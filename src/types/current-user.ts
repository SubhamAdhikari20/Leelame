// src/types/current-user.ts

type UserRole = "buyer" | "seller" | "admin";

export type CurrentUser = {
    _id: string;
    email: string;
    role: UserRole | string;
    isVerified: boolean;
    baseUserId: string;
    fullName?: string | null;
    username?: string | null;
    contact?: string | null;
    bio?: string | null;
    isPermanentlyBanned?: boolean | null;
    profilePictureUrl?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export type CurrentUserProps = {
    currentUser: CurrentUser;
};

export type CurrentUserResponseType = {
    success: boolean;
    message: string;
    user?: CurrentUser | null;
};