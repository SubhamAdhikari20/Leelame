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
import { Calendar, ChevronRight, Home, Inbox, Search, Settings } from "lucide-react";
import NavUser from "@/components/admin/nav-user.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Link from "next/link";
import { CurrentUserProps } from "@/types/current-user.type";


// Menu items
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
    // {
    //     title: "Settings",
    //     url: "/settings",
    //     icon: Settings,
    // },

];
const items2 = [
    {
        title: "Settings",
        // url: "/settings",
        icon: Settings,
        isActive: true,
        items: [
            {
                title: "Seller Management",
                url: "/admin/settings/manage-seller",
            },
            {
                title: "Starred",
                url: "#",
            },
            {
                title: "Account Settings",
                url: "#",
            },
        ],
    },
];

const AdminSidebar = ({ currentUser, ...props }: CurrentUserProps & React.ComponentProps<typeof Sidebar>) => {
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

                                {items2.map((item) => (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.isActive}
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
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
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

export default AdminSidebar;