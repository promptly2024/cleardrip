// src/app/dashboard/layout.tsx
import type React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { DashboardHeader } from './dashboard/componenets/dashboard-header';
import { AppSidebar } from './dashboard/componenets/Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <Toaster />
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset className="flex-1">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
