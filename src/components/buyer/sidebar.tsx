// /src/components/buyer/sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Trophy,
    Heart,
    UserCog,
    LogOut,
    Menu,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet.tsx";
import { Button } from "../ui/button.tsx";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
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
} from "../ui/alert-dialog.tsx";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { handleBuyerLogout } from "@/lib/actions/auth/buyer-auth.action.ts";
import type { CurrentUserProps } from "@/types/current-user.type.ts";


const Sidebar = ({ currentUser }: CurrentUserProps) => {
    const router = useRouter();
    const currentPath = usePathname();


    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "dashboard" },
        { name: "Winning Bids", icon: <Trophy size={18} />, path: "winning-bids" },
        { name: "My Favorites", icon: <Heart size={18} />, path: "favorites" },
        { name: "Profile Settings", icon: <UserCog size={18} />, path: "settings" },
    ];

    const handleLogout = async () => {
        const logoutResponse = await handleBuyerLogout();
        if (!logoutResponse.success) {
            toast.error("Failed to logout: ", {
                description: logoutResponse.message,
            });
            return;
        }
        await signOut({ redirect: false });
        router.replace("/login");
        toast.success("Logout Successful.", {
            description: logoutResponse.message
        });
    };

    const SidebarContent = () => (
        <div className="flex flex-col p-5">
            {/* Profile Section */}
            <div className="flex flex-col items-center py-5 border-b dark:border-gray-700">
                <Avatar className="w-16 h-16 border border-gray-900 dark:border-gray-100">
                    {currentUser?.profilePictureUrl ? (
                        <AvatarImage
                            src={currentUser.profilePictureUrl}
                            alt={currentUser.fullName ?? "Profile Picture Preview"}
                        />
                    ) : (
                        <AvatarFallback>
                            {(
                                currentUser?.fullName ??
                                currentUser?.username ??
                                "U"
                            )
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
                <h1 className="mt-2 font-bold text-gray-900 dark:text-gray-100">
                    {currentUser?.fullName}
                </h1>
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                    {currentUser?.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {currentUser?.email}
                </p>
            </div>

            {/* Scrollable Menu */}
            <ScrollArea className="flex-1 mt-4">
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item, index) => {
                        const isActive = currentPath.includes(item.path);
                        return (
                            <Link
                                key={index}
                                href={`/${currentUser?.username}/my-profile/${item.path}`}
                            >
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 rounded-lg text-gray-700 transition ${isActive
                                        ? "bg-green-100 dark:bg-gray-100 text-green-700 font-semibold"
                                        : "dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-500"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="py-4 border-t mt-4">
                <Link href="/seller">
                    <h1 className="font-semibold text-green-500 hover:text-green-600 hover:dark:text-green-400 hover:underline transition-all duration-200 mb-3">
                        Become a seller
                    </h1>
                </Link>

                {/* Logout */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="w-full justify-start gap-3 dark:text-white bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-500"
                        >
                            <LogOut size={18} />
                            Log Out
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
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );

    return (
        <div>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-full sticky top-30 inset-x-0 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar (Sheet Drawer) */}
            <div className="md:hidden p-3 flex items-center justify-between w-full bg-white dark:bg-gray-900 border-b">
                <h1 className="text-lg font-semibold">Menu</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Sidebar;