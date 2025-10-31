"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CalendarDays,
    Plus,
    Search,
    LogOut,
    Eye,
    X,
    Calendar,
    RotateCcw,
    Clock,
    IndianRupee,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Timer,
    Grid3X3,
    List,
    Download
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ServicesClass } from '@/lib/httpClient/services';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/core/Loader';
import { UnauthorizedAccess } from '@/components/core/UnauthorizedAccess';
import { ServicesResponse } from '@/lib/types/services';
import { toast } from 'sonner';

type ViewMode = 'table' | 'cards';
type StatusFilter = 'all' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
type SortBy = 'newest' | 'oldest' | 'price' | 'status';

export default function MyServices() {
    const { authenticated, authLoading, isUser, isAdmin, isSuperAdmin, user, logout } = useAuth();
    const [data, setData] = useState<ServicesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [sortBy, setSortBy] = useState<SortBy>('newest');
    const [viewMode, setViewMode] = useState<ViewMode>('cards');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (authenticated) {
            fetchServices();
        }
    }, [currentPage, limit, authenticated]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const result = await ServicesClass.getAllServices(currentPage, limit);
            setData(result as ServicesResponse);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            toast.error('Failed to load services', {
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (serviceId: string) => {
        try {
            setSelectedService(null);
            // Add your cancel booking API call here
            toast.success('This feature is not yet implemented', {
                description: 'Your booking has been cancelled.',
                action: {
                    label: 'Undo',
                    onClick: () => {
                        // Handle undo action
                    }
                }
            });
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const handleReschedule = (serviceId: string) => {
        setSelectedService(null)
        toast.error('This feature is not yet implemented', {
            description: 'Your booking has been rescheduled.',
            action: {
                label: 'Undo',
                onClick: () => {
                    // Handle undo action
                }
            }
        });
        // router.push(`/services/${serviceId}/reschedule`);
    };

    const handleRebook = (service: any) => {
        setSelectedService(null)
        toast.error('This feature is not yet implemented', {
            description: 'Your booking has been rebooked.',
            action: {
                label: 'Undo',
                onClick: () => {
                    // Handle undo action
                }
            }
        });
        // router.push(`/services/${service.service.id}/book`);
    };

    const handleDownloadInvoice = (serviceId: string) => {
        toast.info('Download invoice feature coming soon!', {
            description: 'Currently, invoices are not available for download.',
            action: {
                label: 'Okay',
                onClick: () => {
                    // Handle action
                }
            }
        });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: AlertCircle,
                label: 'Pending'
            },
            scheduled: {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: Calendar,
                label: 'Scheduled'
            },
            in_progress: {
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: Timer,
                label: 'In Progress'
            },
            completed: {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: CheckCircle2,
                label: 'Completed'
            },
            cancelled: {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: XCircle,
                label: 'Cancelled'
            }
        };
        return configs[status.toLowerCase() as keyof typeof configs] || configs.pending;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getFilteredAndSortedServices = () => {
        if (!data?.services) return [];

        let filtered = [...data.services];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(service =>
                service.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.service.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.service.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(service =>
                service.status.toLowerCase() === statusFilter
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'price':
                    return a.service.price - b.service.price;
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'newest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return filtered;
    };

    const ServiceCard = ({ service }: { service: any }) => {
        const statusConfig = getStatusConfig(service.status);
        const StatusIcon = statusConfig.icon;

        return (
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{service.service.name}</CardTitle>
                            <CardDescription className="mt-1">
                                {service.service.description}
                            </CardDescription>
                        </div>
                        <Badge className={`${statusConfig.color} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(service.slot.startTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{formatTime(service.slot.startTime)} - {formatTime(service.slot.endTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            <span className="font-semibold text-green-600">₹{service.service.price}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Timer className="w-4 h-4 mr-2" />
                            <span>{service.service.duration} mins</span>
                        </div>
                    </div>

                    {/* Images */}
                    {(service.beforeImageUrl || service.afterImageUrl) && (
                        <div className="flex space-x-2">
                            {service.beforeImageUrl && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Before</p>
                                    <img
                                        src={service.beforeImageUrl}
                                        alt="Before"
                                        className="w-full h-20 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                            {service.afterImageUrl && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">After</p>
                                    <img
                                        src={service.afterImageUrl}
                                        alt="After"
                                        className="w-full h-20 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedService(service)}
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                        </Button>

                        {service.status.toLowerCase() === 'completed' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRebook(service)}
                                className="text-blue-600"
                            >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Rebook
                            </Button>
                        )}

                        {/* {['pending', 'scheduled'].includes(service.status.toLowerCase()) && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReschedule(service.id)}
                                    className="text-blue-600"
                                >
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Reschedule
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(service.id)}
                                    className="text-red-600 hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                </Button>
                            </>
                        )} */}
                    </div>

                    {/* Booking Date */}
                    <div className="text-xs text-gray-500">
                        Booked on {formatDate(service.createdAt)}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const ServiceDetailModal = () => {
        if (!selectedService) return null;

        const statusConfig = getStatusConfig(selectedService.status);
        const StatusIcon = statusConfig.icon;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{selectedService.service.name}</CardTitle>
                                <CardDescription className="mt-1">
                                    Service Details & Information
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedService(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Status */}
                        <div>
                            <h4 className="font-medium mb-2">Status</h4>
                            <Badge className={`${statusConfig.color} border`}>
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {statusConfig.label}
                            </Badge>
                        </div>

                        {/* Service Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Service Information</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-600">Type:</span> {selectedService.service.type}</p>
                                    <p><span className="text-gray-600">Duration:</span> {selectedService.service.duration} minutes</p>
                                    <p><span className="text-gray-600">Price:</span> ₹{selectedService.service.price}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Appointment Details</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-600">Date:</span> {formatDate(selectedService.slot.startTime)}</p>
                                    <p><span className="text-gray-600">Time:</span> {formatTime(selectedService.slot.startTime)} - {formatTime(selectedService.slot.endTime)}</p>
                                    <p><span className="text-gray-600">Booked:</span> {formatDate(selectedService.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-gray-600">{selectedService.service.description}</p>
                        </div>

                        {/* Images */}
                        {(selectedService.beforeImageUrl || selectedService.afterImageUrl) && (
                            <div>
                                <h4 className="font-medium mb-2">Service Images</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedService.beforeImageUrl && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Before Service</p>
                                            <img
                                                src={selectedService.beforeImageUrl}
                                                alt="Before service"
                                                className="w-full h-40 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                    {selectedService.afterImageUrl && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">After Service</p>
                                            <img
                                                src={selectedService.afterImageUrl}
                                                alt="After service"
                                                className="w-full h-40 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            {selectedService.status.toLowerCase() === 'completed' && (
                                <Button onClick={() => handleRebook(selectedService)}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Book Again
                                </Button>
                            )}

                            {/* {['pending', 'scheduled'].includes(selectedService.status.toLowerCase()) && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleReschedule(selectedService.id)}
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleCancelBooking(selectedService.id)}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel Booking
                                    </Button>
                                </>
                            )} */}

                            {/* <Button variant="outline" onClick={() => handleDownloadInvoice(selectedService.id)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    if (!authenticated) {
        return <UnauthorizedAccess />;
    }

    const filteredServices = getFilteredAndSortedServices();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <CalendarDays className="w-8 h-8 text-blue-600" />
                            My Services
                        </h1>
                        <p className="text-gray-600 mt-1">Manage your service bookings and appointments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => router.push('/services')} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Book New Service
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Services</p>
                                    <p className="text-2xl font-bold">{data?.pagination.total || 0}</p>
                                </div>
                                <CalendarDays className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {data?.services.filter(s => s.status.toLowerCase() === 'completed').length || 0}
                                    </p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {data?.services.filter(s => s.status.toLowerCase() === 'pending').length || 0}
                                    </p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">This Month</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {data?.services.filter(s =>
                                            new Date(s.createdAt).getMonth() === new Date().getMonth()
                                        ).length || 0}
                                    </p>
                                </div>
                                <Timer className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Controls */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-3 flex-wrap">
                                <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="price">Price</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View Mode Toggle */}
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                    <Button
                                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('cards')}
                                        className="rounded-none"
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                        className="rounded-none"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredServices.length} of {data?.pagination.total || 0} services
                        </div>
                    </CardContent>
                </Card>

                {/* Services Content */}
                {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                        {loading && <LoadingSpinner />}
                        {filteredServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                ) : (
                    <Card className="mb-6">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredServices.map((service) => {
                                        const statusConfig = getStatusConfig(service.status);
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <TableRow key={service.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{service.service.name}</p>
                                                        <p className="text-sm text-gray-500">{service.service.type}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{formatDate(service.slot.startTime)}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatTime(service.slot.startTime)} - {formatTime(service.slot.endTime)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${statusConfig.color} border`}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-600">
                                                    ₹{service.service.price}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedService(service)}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                        {service.status.toLowerCase() === 'completed' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRebook(service)}
                                                            >
                                                                <RotateCcw className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {filteredServices.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {data?.services.length === 0 ? 'No services booked yet' : 'No services match your filters'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {data?.services.length === 0
                                    ? 'Book your first service to get started'
                                    : 'Try adjusting your search or filter criteria'
                                }
                            </p>
                            {data?.services.length === 0 ? (
                                <Button onClick={() => router.push('/services')}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Book Your First Service
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {data?.pagination && data.services.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {Math.ceil(data.pagination.total / data.pagination.total)}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (data.pagination.hasNext) {
                                        setCurrentPage((p) => p + 1);
                                    }
                                }}
                                disabled={!data.pagination.hasNext}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {selectedService && <ServiceDetailModal />}
        </div>
    )
}