"use client";
import React, { useState, useEffect, useCallback, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ServiceDefinition } from '@/lib/types/services';
import { APIURL } from '@/utils/env';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Plus,
    Edit3,
    Trash2,
    Clock,
    LucideIndianRupee,
    Image as ImageIcon,
    Calendar,
    Search,
    Filter,
    Eye,
    EyeOff,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    createdAt: string;
}

const ADMINSERVICES = () => {
    const {
        authenticated,
        authLoading,
        logout,
        isSuperAdmin,
        isAdmin,
        user: loggedInUser,
        role
    } = useAuth();

    const router = useRouter();

    // States
    const [loading, setLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"ALL" | "AMC" | "URGENT">("ALL");
    const [showInactive, setShowInactive] = useState(false);

    // Form states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [type, setType] = useState<"AMC" | "URGENT">("AMC");
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isActive, setIsActive] = useState(true);

    // Services and slots
    const [services, setServices] = useState<ServiceDefinition[]>([]);
    const [filteredServices, setFilteredServices] = useState<ServiceDefinition[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);

    // Slot form states
    const [slotStartTime, setSlotStartTime] = useState("");
    const [slotEndTime, setSlotEndTime] = useState("");
    const [bulkSlotDate, setBulkSlotDate] = useState("");
    const [bulkSlotCount, setBulkSlotCount] = useState(8);

    // Authentication check
    useEffect(() => {
        if (!authLoading && !authenticated) {
            toast.error("You must be logged in to access this page", {
                description: "Please log in to continue.",
                action: {
                    label: "Login",
                    onClick: () => router.push("/admin/signin"),
                },
            });
            router.push("/admin/signin");
        }
    }, [authLoading, authenticated, router]);

    // Fetch services
    const fetchServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${APIURL}/public/services?page=1&limit=50`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setServices(data.services || []);
            } else {
                const errorMessage = data.error || data.message || "Failed to fetch services";
                setError(errorMessage);
                toast.error("Something went wrong", {
                    description: errorMessage,
                });
            }
        } catch (error: any) {
            const errorMessage = error.message || "Failed to fetch services";
            setError(errorMessage);
            toast.error("Network error occurred", {
                description: errorMessage,
            });
        } finally {
            filterServices();
            setLoading(false);
        }
    }, []);

    // Fetch slots
    const fetchSlots = useCallback(async () => {
        setSlotsLoading(true);
        try {
            const response = await fetch(`${APIURL}/services/slots`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setSlots(data.slots || []);
            } else {
                toast.error("Failed to fetch slots");
            }
        } catch (error) {
            toast.error("Network error fetching slots");
        } finally {
            setSlotsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
        filterServices();
        fetchSlots();
    }, [fetchServices, fetchSlots]);

    useEffect(() => {
        filterServices();
    }, [services, searchTerm, filterType, showInactive]);

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add service
    const addService = async () => {
        if (!name || !description || !image) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", image);
        formData.append("type", type);
        formData.append("price", price.toString());
        formData.append("duration", duration.toString());
        formData.append("isActive", isActive.toString());

        try {
            const response = await fetch(`${APIURL}/services/add`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                toast.success("Service added successfully!");
                resetForm();
                setIsAddModalOpen(false);
                fetchServices();
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to add service");
            }
        } catch (error) {
            toast.error("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Add single slot
    const addSlot = async () => {
        if (!slotStartTime || !slotEndTime) {
            toast.error("Please select start and end times");
            return;
        }

        const startTime = new Date(slotStartTime);
        const endTime = new Date(slotEndTime);

        if (endTime <= startTime) {
            toast.error("End time must be after start time");
            return;
        }

        setSlotsLoading(true);
        try {
            const response = await fetch(`${APIURL}/services/add/slots`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ startTime, endTime }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                toast.success("Slot added successfully!");
                setSlotStartTime("");
                setSlotEndTime("");
                fetchSlots();
            } else {
                const error = await response.json();
                toast.error(error.message || error.error || "Failed to add slot");
            }
        } catch (error: any) {
            toast.error(error.message || "Network error occurred");
        } finally {
            setSlotsLoading(false);
        }
    };

    // Add bulk slots
    const addBulkSlots = async () => {
        if (!bulkSlotDate || bulkSlotCount <= 0) {
            toast.error("Please select a date and valid slot count");
            return;
        }

        setSlotsLoading(true);
        try {
            const slots = [];
            const baseDate = new Date(bulkSlotDate);

            for (let i = 0; i < bulkSlotCount; i++) {
                const startTime = new Date(baseDate);
                startTime.setHours(9 + i, 0, 0, 0); // Starting from 9 AM
                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + 1); // 1-hour slots

                slots.push({ startTime, endTime });
            }

            await Promise.all(slots.map(async (slot) => {
                const response = await fetch(`${APIURL}/services/add/slots`, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(slot),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    toast.error("Failed to add some slots");
                }
            }));

            toast.success(`${bulkSlotCount} slots added successfully!`);
            setBulkSlotDate("");
            setBulkSlotCount(8);
            fetchSlots();
        } catch (error: any) {
            toast.error(error.message || "Failed to add bulk slots");
        } finally {
            setSlotsLoading(false);
        }
    };

    // Delete selected slots
    const deleteSelectedSlots = async () => {
        if (selectedSlotIds.length === 0) {
            toast.error("Please select slots to delete");
            return;
        }

        setSlotsLoading(true);
        try {
            const response = await fetch(`${APIURL}/services/delete/slots`, {
                method: "DELETE",
                credentials: "include",
                body: JSON.stringify({ slotIds: selectedSlotIds }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                toast.success(`${selectedSlotIds.length} slots deleted successfully!`);
                setSelectedSlotIds([]);
                fetchSlots();
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to delete slots");
            }
        } catch (error) {
            toast.error("Network error occurred");
        } finally {
            setSlotsLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setName("");
        setDescription("");
        setImage(null);
        setImagePreview("");
        setType("AMC");
        setPrice(0);
        setDuration(0);
        setIsActive(true);
    };

    // Filter services
    const filterServices = useCallback(() => {
        const filteredServices = services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === "ALL" || service.type === filterType;
            const matchesStatus = showInactive || service.isActive;

            return matchesSearch && matchesType && matchesStatus;
        });
        setFilteredServices(filteredServices);
    }, [services, searchTerm, filterType, showInactive]);

    // Toggle slot selection
    const toggleSlotSelection = (slotId: string) => {
        setSelectedSlotIds(prev =>
            prev.includes(slotId)
                ? prev.filter(id => id !== slotId)
                : [...prev, slotId]
        );
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!authenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Services</h1>
                            <p className="text-gray-600 mt-1">Manage your services and availability slots</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setIsSlotModalOpen(true)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Manage Slots
                            </button>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Service
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as "ALL" | "AMC" | "URGENT")}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ALL">All Types</option>
                                <option value="AMC">AMC</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                            <button
                                onClick={() => setShowInactive(!showInactive)}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${showInactive
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {showInactive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={fetchServices}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div key={service.id} className={`bg-white rounded-lg shadow-sm overflow-hidden transition-opacity ${!service.isActive ? 'opacity-60' : ''}`}>
                                <div className="aspect-video bg-gray-200 relative">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.type === 'URGENT'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {service.type}
                                        </span>
                                    </div>
                                    {!service.isActive && (
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Inactive
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <LucideIndianRupee className="w-4 h-4 mr-1" />
                                            {service.price}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {service.duration}min
                                        </div>
                                    </div>
                                    {/* <div className="flex gap-2">
                                        <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                            <Edit3 className="w-4 h-4 mx-auto" />
                                        </button>
                                        <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                            <Trash2 className="w-4 h-4 mx-auto" />
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Service Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold">Add New Service</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Service name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Service description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                                                <button
                                                    onClick={() => {
                                                        setImage(null);
                                                        setImagePreview("");
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Click to upload image</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value as "AMC" | "URGENT")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="AMC">AMC</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 p-6 border-t">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addService}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Service"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Slot Management Modal */}
                {isSlotModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold">Manage Slots</h2>
                                <button
                                    onClick={() => setIsSlotModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Add Single Slot */}
                                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-3">Add Single Slot</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                value={slotStartTime}
                                                onChange={(e) => setSlotStartTime(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                            <input
                                                type="datetime-local"
                                                value={slotEndTime}
                                                onChange={(e) => setSlotEndTime(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={addSlot}
                                                disabled={slotsLoading}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                                            >
                                                {slotsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Slot"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Bulk Slots */}
                                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-3">Add Bulk Slots</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                value={bulkSlotDate}
                                                onChange={(e) => setBulkSlotDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Slots</label>
                                            <input
                                                type="number"
                                                value={bulkSlotCount}
                                                onChange={(e) => setBulkSlotCount(Number(e.target.value))}
                                                min="1"
                                                max="24"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={addBulkSlots}
                                                disabled={slotsLoading}
                                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                                            >
                                                {slotsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Bulk"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Existing Slots */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium text-gray-900">Existing Slots</h3>
                                        {selectedSlotIds.length > 0 && (
                                            <button
                                                onClick={deleteSelectedSlots}
                                                disabled={slotsLoading}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
                                            >
                                                {slotsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                                Delete Selected ({selectedSlotIds.length})
                                            </button>
                                        )}
                                    </div>

                                    {slotsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    ) : slots.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                            <p>No slots available</p>
                                        </div>
                                    ) : (
                                        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                                {slots.map((slot) => (
                                                    <div
                                                        key={slot.id}
                                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedSlotIds.includes(slot.id)
                                                            ? 'border-blue-500 bg-blue-50'
                                                            // : slot.isBooked
                                                            // ? 'border-red-300 bg-red-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    // onClick={() => !slot.isBooked && toggleSlotSelection(slot.id)}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            {/* <input
                                                                type="checkbox"
                                                                checked={selectedSlotIds.includes(slot.id)}
                                                                onChange={() => !slot.isBooked && toggleSlotSelection(slot.id)}
                                                                disabled={slot.isBooked}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                                            />
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${slot.isBooked
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {slot.isBooked ? 'Booked' : 'Available'}
                                                            </span> */}
                                                        </div>
                                                        <div className="text-sm">
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(slot.startTime).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-gray-600">
                                                                {new Date(slot.startTime).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })} - {new Date(slot.endTime).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredServices.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || filterType !== "ALL" || !showInactive
                                ? "Try adjusting your filters to see more services."
                                : "Get started by creating your first service."}
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Service
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                {!loading && services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                                    <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {services.filter(s => s.isActive).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Available Slots</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {/* {slots.filter(s => !s.isBooked).length} */}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ADMINSERVICES;