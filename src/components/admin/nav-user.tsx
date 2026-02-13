// src/components/admin/nav-currentUser.tsx
"use client"
import { Bell } from "lucide-react";
import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconUserCircle,
} from "@tabler/icons-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar.tsx";
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
} from "@/components/ui/alert-dialog.tsx";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { CurrentUserPropsType } from "@/types/current-user.type.ts";
import { handleAdminLogout } from "@/lib/actions/admin/profile-details.action.ts";


const NavUser = ({ currentUser }: CurrentUserPropsType) => {
    const router = useRouter();
    const { isMobile } = useSidebar();

    const handleLogout = async () => {
        const logoutResponse = await handleAdminLogout();
        if (!logoutResponse.success) {
            toast.error("Failed to logout", {
                description: logoutResponse.message,
            });
            return;
        }
        router.replace("/admin/login");
        toast.success("Logout Successful.", {
            description: logoutResponse.message
        });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer mt-auto px-3 py-2"
                        >
                            <Avatar className="h-8 w-8 border border-gray-600 dark:border-gray-100">
                                {currentUser && currentUser.profilePictureUrl ? (
                                    <Image
                                        fill
                                        src={currentUser.profilePictureUrl}
                                        alt={currentUser.fullName || "Admin"}
                                    />
                                ) : (
                                    <AvatarFallback>
                                        {(
                                            (currentUser && currentUser.fullName) ||
                                            "NaN"
                                        )
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{currentUser?.fullName}</span>
                                <span className="truncate text-xs">{currentUser?.email}</span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 border border-gray-600 dark:border-gray-100">
                                    {currentUser && currentUser.profilePictureUrl ? (
                                        <Image
                                            fill
                                            src={currentUser.profilePictureUrl}
                                            alt={currentUser.fullName || "Seller"}
                                        />
                                    ) : (
                                        <AvatarFallback>
                                            {(
                                                (currentUser && currentUser.fullName) ||
                                                "NaN"
                                            )
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{currentUser
                                        ?.fullName}</span>
                                    <span className="truncate text-xs">{currentUser?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => router.push("/admin/settings/account")}>
                                <IconUserCircle />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconCreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <IconLogout />
                                    Log out
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-lg">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure you want to logout?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will end your session and
                                        return you to the login page.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-green-600! hover:bg-green-500! text-white"
                                        onClick={() => {
                                            handleLogout();
                                        }}
                                    >
                                        Logout
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export default NavUser;