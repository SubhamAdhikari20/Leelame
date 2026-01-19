// src/components/admin/sidebar.tsx
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
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import NavUser from "@/components/admin/nav-user.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Link from "next/link";


const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/images/avatar.png",
};

// Menu items.
const items = [
    {
        title: "Home",
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

const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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
                    <NavUser user={user} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </div>
    );
};

export default AdminSidebar;