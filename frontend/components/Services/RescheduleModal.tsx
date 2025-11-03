"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    availableSlots: any[];
    onSuccess: () => void;
    onReschedule: (bookingId: string, slotId: string) => Promise<void>;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    booking,
    availableSlots,
    onSuccess,
    onReschedule
}) => {
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !booking) return null;

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

    const handleReschedule = async () => {
        if (!selectedSlotId) {
            setError('Please select a new slot');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await onReschedule(booking.id, selectedSlotId);
            toast.success('Service rescheduled successfully!', {
                description: 'Your booking has been moved to the new time slot.'
            });
            setSelectedSlotId('');
            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reschedule';
            setError(errorMessage);
            toast.error('Reschedule failed', {
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    const selectedSlot = availableSlots.find(slot => slot.id === selectedSlotId);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Reschedule Service</CardTitle>
                            <CardDescription>
                                Choose a new time slot for your service
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Current Booking Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-2">Current Booking</h4>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Service:</span> {booking.service.name}</p>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-3 h-3 mr-2" />
                                {formatDate(booking.slot.startTime)}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-3 h-3 mr-2" />
                                {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Slot Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select New Time Slot</label>
                        <Select value={selectedSlotId} onValueChange={setSelectedSlotId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a new slot..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {availableSlots.length > 0 ? (
                                    availableSlots.map((slot) => (
                                        <SelectItem key={slot.id} value={slot.id}>
                                            {formatDate(slot.startTime)} • {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-gray-500 text-sm">
                                        No available slots
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selected Slot Preview */}
                    {selectedSlot && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-2">New Slot Preview</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center text-green-700">
                                    <Calendar className="w-3 h-3 mr-2" />
                                    {formatDate(selectedSlot.startTime)}
                                </div>
                                <div className="flex items-center text-green-700">
                                    <Clock className="w-3 h-3 mr-2" />
                                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReschedule}
                            disabled={loading || !selectedSlotId}
                            className="flex-1 cursor-pointer"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
