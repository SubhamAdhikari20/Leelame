// src/components/profile-popover.tsx
"use client";
import React from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog.tsx";
import { Button } from "./ui/button.tsx";
import { CurrentUser } from "@/types/current-user.ts";


interface ProfilePopoverProps {
    currentUser: CurrentUser | null;
    logoutDialogOpen: boolean;
    setLogoutDialogOpen: (open: boolean) => void;
    setDesktopMenuOpen: (open: boolean) => void;
    setMobileMenuOpen: (open: boolean) => void;
    handleLogout: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({
    currentUser,
    logoutDialogOpen,
    setLogoutDialogOpen,
    setDesktopMenuOpen,
    setMobileMenuOpen,
    handleLogout,
}) => {
    if (!currentUser || !currentUser.buyerProfile) {
        return null;
    }

    return (
        <div className="absolute right-0 mt-3 w-70 bg-white dark:bg-background rounded-lg shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 overflow-hidden z-20">
            {/* Profile Header */}
            <div className="px-4 py-3 text-center">
                <Avatar className="mx-auto h-12 w-12 border border-gray-900 dark:border-gray-100">
                    {currentUser.profilePictureUrl ? (
                        <AvatarImage
                            src={
                                currentUser.profilePictureUrl
                            }
                            alt={currentUser.buyerProfile.fullName}
                        />
                    ) : (
                        <AvatarFallback>
                            {(
                                currentUser.buyerProfile.fullName ??
                                currentUser.buyerProfile.username ??
                                "U"
                            )
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
                <h1 className="mt-2 font-bold text-gray-900 dark:text-white">
                    {currentUser.buyerProfile.fullName}
                </h1>
                <h2 className="mt-2 font-semibold text-gray-800 dark:text-gray-100">
                    {currentUser.buyerProfile.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.email}
                </p>
            </div>

            {/* Action */}
            <div className="grid grid-cols-2 gap-1 px-3 pb-3">
                {/* Profile Link */}
                <Link
                    href={`/${currentUser.buyerProfile.username}/my-profile/dashboard`}
                    className="flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                        setDesktopMenuOpen(false);
                        setMobileMenuOpen(false);
                    }}
                >
                    <FaUser /> My Profile
                </Link>

                {/* Logout Button */}
                <AlertDialog
                    open={logoutDialogOpen}
                    onOpenChange={setLogoutDialogOpen}
                >
                    <AlertDialogTrigger asChild>
                        <Button
                            className="flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() =>
                                setLogoutDialogOpen(
                                    true
                                )
                            }
                        >
                            <FaSignOutAlt /> Logout
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to
                                logout?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will end your
                                session and return you
                                to the sign-in page.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setLogoutDialogOpen(
                                        false
                                    );
                                    setDesktopMenuOpen(
                                        false
                                    );
                                    setMobileMenuOpen(
                                        false
                                    );
                                }}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => {
                                    handleLogout();
                                    setLogoutDialogOpen(
                                        false
                                    );
                                    setDesktopMenuOpen(
                                        false
                                    );
                                    setMobileMenuOpen(
                                        false
                                    );
                                }}
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-2 text-center text-xs text-gray-400 dark:text-gray-300">
                Secured by <strong>Leelame</strong>
            </div>
        </div>
    )
}

export default ProfilePopover;