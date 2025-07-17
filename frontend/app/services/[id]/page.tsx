"use client"

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, Image as ImageIcon, Edit, Trash2, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/lib/types/services';
import { ServicesClass } from '@/lib/httpClient/services';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/core/Loader';
import { UnauthorizedAccess } from '@/components/core/UnauthorizedAccess';


interface ServiceDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ServiceDetailsPage({ params }: ServiceDetailPageProps) {
    const { authenticated, authLoading, isUser, isAdmin, isSuperAdmin, user } = useAuth();
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (id && authenticated) {
        fetchService();
        }
    }, [id, authenticated]);

    const fetchService = async () => {
        try {
            const result = await ServicesClass.getServicesById(id as string);
            console.log(result);
            setService(result.service);
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } 
        finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!isAdmin || !isSuperAdmin) {
            setError('Only admins can update service status');
            return;
        }

        setStatusLoading(true);
        try {
            const result = await ServicesClass.updateServiceStatus(id, newStatus);
            setService(result);
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update status');
        } 
        finally {
            setStatusLoading(false);
        }
    };

    const deleteService = async () => {
        if (!confirm('Are you sure you want to cancel this service?')) return;

        try {
            await ServicesClass.deleteService(id);
            router.push('/services');
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel service');
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canUpdateStatus = () => {
        return isAdmin || isSuperAdmin;
    };

    const canDeleteService = () => {
        if (!service) return false;
        if (service.status === 'COMPLETED') return false;

        if (isAdmin || isSuperAdmin) return true;
        return isUser && user?.id;
    };


    // Show loading spinner while checking authentication
    if (authLoading) {
        return <LoadingSpinner />;
    }

    // Show unauthorized if not logged in or doesn't have required role
    if (!authenticated || (!isUser && !isAdmin && !isSuperAdmin)) {
        return <UnauthorizedAccess />;
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
        <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/services')} className="mt-4">
            Back to Services
            </Button>
        </div>
        );
    }

    if (!service) {
        return (
        <div className="container mx-auto px-4 py-8">
            <Alert>
            <AlertDescription>Service not found</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/services')} className="mt-4">
            Back to Services
            </Button>
        </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push('/services')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
            </Button>
            <h1 className="text-2xl font-bold">Service Details</h1>
            <Badge variant="outline">
            {isAdmin || isSuperAdmin ? 'Admin View' : 'User View'}
            </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Service #{service.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                        {service.type} Service
                    </CardDescription>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                    {service.status}
                    </Badge>
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="text-sm font-medium text-gray-600">Service Type</label>
                    <p className="mt-1">
                        <Badge variant={service.type === 'URGENT' ? 'destructive' : 'default'}>
                        {service.type}
                        </Badge>
                    </p>
                    </div>
                    <div>
                    <label className="text-sm font-medium text-gray-600">Scheduled Date</label>
                    <p className="mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(service.scheduledDate)}
                    </p>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="mt-1">{formatDate(service.createdAt)}</p>
                    </div>
                    <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="mt-1">{formatDate(service.updatedAt)}</p>
                    </div>
                </div>

                {/* {(service.beforeImageUrl || service.afterImageUrl) && (
                    <>
                    <Separator />
                    <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-3">
                        <ImageIcon className="w-4 h-4" />
                        Service Images
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.beforeImageUrl && (
                            <div>
                            <p className="text-sm text-gray-600 mb-2">Before</p>
                            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                src={service.beforeImageUrl}
                                alt="Before service"
                                fill
                                className="object-cover"
                                />
                            </div>
                            </div>
                        )}
                        {service.afterImageUrl && (
                            <div>
                            <p className="text-sm text-gray-600 mb-2">After</p>
                            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                src={service.afterImageUrl}
                                alt="After service"
                                fill
                                className="object-cover"
                                />
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    </>
                )} */}
                </CardContent>
            </Card>
            </div>

            <div className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                {canUpdateStatus() && (
                    <div>
                    <label className="text-sm font-medium text-gray-600">Update Status</label>
                    <Select 
                        value={service.status} 
                        onValueChange={updateStatus}
                        disabled={statusLoading}
                    >
                        <SelectTrigger className="mt-1">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    {statusLoading && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Updating status...
                        </p>
                    )}
                    </div>
                )}

                {canUpdateStatus() && canDeleteService() && <Separator />}

                {canDeleteService() && (
                    <div className="space-y-2">
                    <Button
                        variant="destructive"
                        onClick={deleteService}
                        className="w-full"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Service
                    </Button>
                    </div>
                )}

                {!canUpdateStatus() && !canDeleteService() && (
                    <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Limited actions available</p>
                    </div>
                )}
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    );
}