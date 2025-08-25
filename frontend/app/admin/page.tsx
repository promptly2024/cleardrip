"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Admin() {
    const { authenticated, authLoading, isAdmin, isSuperAdmin } = useAuth();
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Don't do anything while authentication is loading
        if (authLoading) return;

        setRedirecting(true);

        // If authenticated and is admin/super admin, redirect to dashboard
        if (authenticated && (isAdmin || isSuperAdmin)) {
            router.push('/admin/dashboard');
        }
        // If not authenticated or not an admin, redirect to signin
        else if (!authenticated || (!isAdmin && !isSuperAdmin)) {
            router.push('/admin/signin');
        }
    }, [authenticated, authLoading, isAdmin, isSuperAdmin, router]);

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Checking authentication...</div>
            </div>
        );
    }

    // Show redirecting message
    if (redirecting) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">
                    {authenticated && (isAdmin || isSuperAdmin) 
                        ? "Redirecting to dashboard..." 
                        : "Redirecting to signin..."}
                </div>
            </div>
        );
    }

    return null;
}
