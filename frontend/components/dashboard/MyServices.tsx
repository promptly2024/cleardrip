"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, Plus, Search, Filter, Loader2, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ServicesResponse } from '@/lib/types/services';
import { ServicesClass } from '@/lib/httpClient/services';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/core/Loader';
import { UnauthorizedAccess } from '@/components/core/UnauthorizedAccess';

export default function MyServices() {
    const { authenticated, authLoading, isUser, isAdmin, isSuperAdmin, user, logout } = useAuth();
    const [data, setData] = useState<ServicesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const router = useRouter();

    useEffect(() => {
        if (authenticated) {
            fetchServices();
        }
    }, [currentPage, pageSize, authenticated]);

    const fetchServices = async () => {
        try {
            const result = await ServicesClass.getAllServices(currentPage, pageSize);
            setData(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/user/signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleDisplay = () => {
        if (isSuperAdmin) return 'Super Admin';
        if (isAdmin) return 'Admin';
        if (isUser) return 'User';
        return 'Unknown';
    };


    // Show loading spinner while checking authentication
    if (authLoading) {
        return <LoadingSpinner />;
    }
    // Show unauthorized if not logged in or doesn't have required role
    if (!authenticated) {
        return <UnauthorizedAccess />;
    }
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with user info and logout */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarDays className="w-6 h-6" />
                        Services
                    </h1>
                    <p className="text-gray-600">
                        Welcome, {user?.name || 'User'} • {getRoleDisplay()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.push(`/services/${1}/book`)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Book New Service
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Services</CardTitle>
                    <CardDescription>
                        {data?.message || 'Your service appointments'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <Input placeholder="Search services..." className="w-full" />
                        </div>
                        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 per page</SelectItem>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Scheduled Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>
                                        <Badge variant={service.type === 'URGENT' ? 'destructive' : 'default'}>
                                            {service.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(service.scheduledDate)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(service.status)}>
                                            {service.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(service.createdAt)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/services/${service.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {data?.services.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No services found. <Button variant="link" onClick={() => router.push('/services')}>Book your first service</Button>
                        </div>
                    )}

                    {data?.pagination && data.services.length > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-600">
                                Showing {data.pagination.skip + 1} to {Math.min(data.pagination.skip + data.pagination.take, data.pagination.total)} of {data.pagination.total} results
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!data.pagination.hasNext}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}