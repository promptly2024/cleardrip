/* eslint-disable react/no-unescaped-entities */
'use client';

import {
    ChevronDown,
    Home,
    LogOut,
    Settings,
    MessageSquare,
    User,
    Package,
    CalendarCheck,
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

    // Get navigation items based on role
    const getNavigationItems = () => {
        const baseItems = [
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
        ];

        // Only show additional items for superadmin
        if (role === "SUPER_ADMIN" || isSuperAdmin) {
            return [
                ...baseItems,
                {
                    title: 'Manage Products',
                    url: '/admin/dashboard/products',
                    icon: Package,
                },
                {
                    title: 'Manage Staff',
                    url: '/admin/dashboard/staff',
                    icon: User,
                },
                {
                    title: 'Manage Subscriptions',
                    url: '/admin/dashboard/subscriptions',
                    icon: CalendarCheck,
                },
            ];
        }

        // For regular admin, only return base items
        return baseItems;
    };

    const navigationItems = getNavigationItems();

    useEffect(() => {
        // Prefetch pages based on role
        const pagesToPrefetch = navigationItems.map(item => item.url);
        pagesToPrefetch.forEach((page) => {
            router.prefetch(page);
        });
    }, [router, navigationItems]);

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
                    <SidebarGroupLabel>
                        Navigation
                        {/* Show role indicator */}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                        </span>
                    </SidebarGroupLabel>
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
                                            <span className="truncate text-xs text-muted-foreground">
                                                {role === "SUPER_ADMIN" ? "Super Administrator" : "Administrator"}
                                            </span>
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
