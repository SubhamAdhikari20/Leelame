// src/components/seller/sidebar.tsx
"use client";
import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import NavUser from "@/components/seller/nav-user.tsx";
import Link from "next/link";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { CurrentUserPropsType } from "@/types/current-user.type";


// Menu items
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "/search",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];


const SellerSidebar = ({ currentUser, ...props }: CurrentUserPropsType & React.ComponentProps<typeof Sidebar>) => {
    return (
        <div>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className="data-[slot=sidebar-menu-button]:p-1.5!"
                            >
                                <Link href="/">
                                    <IconInnerShadowTop className="size-5!" />
                                    <span className="text-base font-semibold">Leelame</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <Separator />
                <SidebarFooter>
                    <NavUser currentUser={currentUser} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </div>
    );
};

export default SellerSidebar;