"use client"

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Upload, Clock, Calendar, MapPin, Star, CheckCircle } from 'lucide-react';
import { APIURL } from '@/utils/env';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  type: string;
  image: string;
  imageUrl: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  bookings: Array<{
    slot: {
      id: string;
      startTime: string;
      endTime: string;
      createdAt: string;
      updatedAt: string;
    };
    status: ServiceStatus;
  }>;
}

enum ServiceStatus {
  PENDING = "PENDING",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

interface SlotsDuration {
  id: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceBookingPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<SlotsDuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotsDuration | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [serviceBooked, setServiceBooked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchServiceData();
    fetchSlots();
  }, []);

  useEffect(() => {
    if (serviceBooked) {
      router.push('/user/dashboard?tabs=services')
    }
  }, [serviceBooked]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${APIURL}/services/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Failed to fetch service data';
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      setService(data.service);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching service data';
      toast.error("Some error occured", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick(event) {
            fetchServiceData();
          },
        }
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await fetch(`${APIURL}/services/slots`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Failed to fetch available slots';
        toast.error(errorMessage);
        return;
      }

      setSlots(data.slots || []);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching slots';
      toast.error("Some error occured", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick(event) {
            fetchSlots();
          },
        }
      });
    }
  };

  const bookService = async () => {
    if (!selectedSlot || !service) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      setBookingLoading(true);

      const formData = new FormData();
      if (imageFile) {
        formData.append("beforeImage", imageFile);
      }
      formData.append("slotId", selectedSlot.id);
      formData.append("serviceId", service.id);
      

      const response = await fetch(`${APIURL}/services/book`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Failed to book service';
        const details = data.details ? ` Details: ${JSON.stringify(data.details)}` : '';
        toast.error(errorMessage + details);
        return;
      }

      toast.success("Service booked successfully!", {
        description: `Your service "${service.name}" has been booked for ${new Date(selectedSlot.startTime).toLocaleString()}.`,
        duration: 5000,
        action: {
          label: "View Booking",
          onClick: () => {
            router.push(`/user/dashboard?tabs=services`);
          }
        }
      });
      // Reset form after successful booking
      setSelectedDate(null);
      setSelectedSlot(null);
      setImageFile(null);
      setServiceBooked(true);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while booking service';
      toast.error(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
    setSelectedDate(null);
  };

  const getAvailableSlotsForDate = (day: number) => {
    const selectedDateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return slots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return slotDate.toDateString() === selectedDateObj.toDateString();
    });
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Service Information */}
          <div className="space-y-6">
            {/* Service Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h1>
                  <p className="text-gray-600 text-lg">{service.description}</p>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm text-gray-600">4.9</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">{service.duration} mins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">₹{service.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Service</span>
                </div>
              </div>
            </div>

            {/* Service Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Service Preview & Upload</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Service Illustration */}
                <div className="relative">
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium z-10">
                    SERVICE
                  </div>
                  <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg overflow-hidden">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Service Preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Before Image Upload */}
                <div className="relative group">
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium z-10">
                    BEFORE
                  </div>
                  <div
                    className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Before service"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Upload Before Image</p>
                        <p className="text-xs text-gray-400 mt-1">Click to select image</p>
                      </div>
                    )}
                  </div>
                  {imageFile && (
                    <Button
                      className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Upload Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Upload Instructions:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Please upload a clear image of the item before servicing</li>
                  <li>• Accepted formats: JPG, PNG, WEBP (Max 5MB)</li>
                  <li>• After servicing, our team will update with the result image</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Interface */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 text-center">
                Select your preferred date and time
              </h2>

              {/* Calendar */}
              <div className="mb-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h3 className="text-lg font-semibold text-blue-600">{monthName}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const hasSlots = day ? getAvailableSlotsForDate(day).length > 0 : false;
                    return (
                      <button
                        key={index}
                        onClick={() => day && hasSlots && setSelectedDate(day)}
                        className={`
                                                    h-8 sm:h-10 text-xs sm:text-sm rounded-lg transition-colors relative
                                                    ${!day ? "invisible" : ""}
                                                    ${!hasSlots && day ? "text-gray-300 cursor-not-allowed" : ""}
                                                    ${day === selectedDate
                            ? "bg-green-500 text-white font-medium"
                            : hasSlots ? "hover:bg-gray-100 text-gray-700" : ""
                          }
                                                `}
                        disabled={!day || !hasSlots}
                      >
                        {day}
                        {hasSlots && (
                          <div className="absolute bottom-0 right-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Available slots for {formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate).toISOString())}:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {getAvailableSlotsForDate(selectedDate).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                                                    py-2 px-3 rounded-lg border text-sm font-medium transition-colors
                                                    ${slot.id === selectedSlot?.id
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }
                                                `}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              {selectedSlot && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Summary:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Service: {service.name}</p>
                    <p>Date: {formatDate(selectedSlot.startTime)}</p>
                    <p>Time: {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
                    <p className="font-semibold text-green-600">Total: ₹{service.price}</p>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={bookService}
                disabled={!selectedSlot || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}