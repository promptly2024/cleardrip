/* eslint-disable react/no-unescaped-entities */
'use client';

import {
    ChevronDown,
    Home,
    LogOut,
    Settings,
    MessageSquare,
    User,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@radix-ui/react-separator';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const navigationItems = [
    {
        title: 'Overview',
        url: '/admin/dashboard',
        icon: Home,
    },
    {
        title: 'Manage Services and Slots',
        url: '/admin/dashboard/services',
        icon: MessageSquare,
    },
    {
        title: 'Manage Products',
        url: '/admin/dashboard/products',
        icon: User,
    },
    {
        title: 'Manage Staff',
        url: '/admin/dashboard/staff',
        icon: User,
    },
    {
        title: 'Manage Subscription',
        url: '/admin/dashboard/subscriptions',
        icon: User,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const {
        authenticated,
        authLoading,
        logout,
        isSuperAdmin,
        isAdmin,
        user: loggedInUser,
        role,
    } = useAuth();

    useEffect(() => {
        // prefetch all pages already for faster navigation
        const pagesToPrefetch = [
            '/admin/dashboard',
            '/admin/dashboard/services',
            '/admin/dashboard/products',
            '/admin/dashboard/staff',
            '/admin/dashboard/subscription',
        ];
        pagesToPrefetch.forEach((page) => {
            router.prefetch(page);
        });
    }, [router]);

    const ClearDripLogo = '/cleardrip-logo.png';

    const email = loggedInUser?.email;
    const userInitials = loggedInUser?.name || email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'ADMIN';
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed');
        }
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/" className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <img src={ClearDripLogo} alt="Logo" className="h-6 w-6" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">CLEAR DRIP</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Dashboard
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <Separator className="my-2" />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Settings />
                                            <span>Account</span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <a href="/admin/dashboard/profile">
                                                        <User />
                                                        <span>Profile</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <a href="/admin/dashboard/security">
                                                        <Settings />
                                                        <span>Security</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>

            <SidebarFooter>
                {!authLoading && loggedInUser && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={loggedInUser.avatar} alt={email} />
                                            <AvatarFallback className="rounded-lg">
                                                {userInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {loggedInUser.name || userInitials}
                                            </span>
                                            <span className="truncate text-xs">{email}</span>
                                        </div>
                                        <ChevronDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    {/* <DropdownMenuItem asChild>
                                        <a href="/admin/dashboard/profile">
                                            <User />
                                            Profile
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href="/admin/dashboard/settings">
                                            <Settings />
                                            Settings
                                        </a>
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
