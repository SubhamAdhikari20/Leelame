// src/components/seller/sidebar.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar.tsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import { Separator } from "@/components/ui/separator.tsx";
import NavUser from "@/components/seller/nav-user.tsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Inbox, Search, Settings, ChevronRight, ShoppingBag } from "lucide-react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { CurrentUserPropsType } from "@/types/current-user.type";


const SellerSidebar = ({ currentUser, ...props }: CurrentUserPropsType & React.ComponentProps<typeof Sidebar>) => {
    const currentPath = usePathname();

    // Menu items
    const items = [
        {
            title: "Dashboard",
            // path: "/",
            path: "/seller/dashboard",
            icon: Home,
        },
        {
            title: "Inbox",
            path: "/inbox",
            icon: Inbox,
        },
        {
            title: "Calendar",
            path: "/calendar",
            icon: Calendar,
        },
        {
            title: "Search",
            path: "/search",
            icon: Search,
        },
        {
            title: "Settings",
            path: "/settings",
            icon: Settings,
        },

    ];

    const items2 = [
        {
            title: "Products",
            icon: ShoppingBag,
            isActive: false,
            items: [
                {
                    title: "Manage Products",
                    path: "/seller/products/manage/list",
                },
                {
                    title: "Add Products",
                    path: "/seller/products/add",
                },
            ],
        },
    ];

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
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => {
                                    const isActive = currentPath === item.path;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild className={`${isActive
                                                && "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 font-semibold"}`}>
                                                <Link href={item.path}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}

                                {items2.map((item) => {
                                    const isOpen = item.items.some((subItem) => currentPath === subItem.path);
                                    return (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={isOpen}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.map((subItem) => {
                                                            const isActive = currentPath === subItem.path;
                                                            return (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton asChild className={`${isActive
                                                                        && "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 font-semibold"}`}>
                                                                        <Link href={subItem.path}>
                                                                            <span>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                })}
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