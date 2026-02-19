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
import { Calendar, ChevronRight, Home, Inbox, Search, Settings, ShoppingBag } from "lucide-react";
import NavUser from "@/components/admin/nav-user.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CurrentUserPropsType } from "@/types/current-user.type";


const AdminSidebar = ({ currentUser, ...props }: CurrentUserPropsType & React.ComponentProps<typeof Sidebar>) => {
    const currentPath = usePathname();

    // Menu items
    const items = [
        {
            title: "Home",
            path: "/admin/dashboard",
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
    ];
    const items2 = [
        {
            title: "Categories",
            icon: ShoppingBag,
            isActive: false,
            items: [
                {
                    title: "Manage Categories",
                    path: "/admin/categories/manage/list",
                },
                {
                    title: "Add Categories",
                    path: "/admin/categories/add",
                },
            ],
        },
        {
            title: "Product Conditions",
            icon: ShoppingBag,
            isActive: false,
            items: [
                {
                    title: "Manage Conditions",
                    path: "/admin/product-conditions/manage/list",
                },
                {
                    title: "Add Conditions",
                    path: "/admin/product-conditions/add",
                },
            ],
        },
        {
            title: "Settings",
            // path: "/settings",
            icon: Settings,
            isActive: false,
            items: [
                {
                    title: "Seller Management",
                    path: "/admin/settings/manage-seller/list",
                },
                {
                    title: "Starred",
                    path: "#",
                },
                {
                    title: "Account Settings",
                    path: "#",
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

export default AdminSidebar;