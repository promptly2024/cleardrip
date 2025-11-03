"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    onSuccess: () => void;
    onCancel: (bookingId: string, reason?: string) => Promise<void>;
}

export const CancelModal: React.FC<CancelModalProps> = ({
    isOpen,
    onClose,
    booking,
    onSuccess,
    onCancel
}) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !booking) return null;

    const handleCancelBooking = async () => {
        try {
            setLoading(true);
            setError('');
            await onCancel(booking.id, reason || undefined);
            toast.success('Service cancelled successfully', {
                description: 'Your booking has been cancelled.'
            });
            setReason('');
            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
            setError(errorMessage);
            toast.error('Cancellation failed', {
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md bg-white border-red-200 my-8">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <CardTitle className="text-red-600">Cancel Service</CardTitle>
                                <CardDescription>
                                    This action cannot be undone
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                disabled={loading}
                                className="ml-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Warning Alert */}
                        <Alert variant="destructive">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>
                                Are you sure you want to cancel this service booking?
                            </AlertDescription>
                        </Alert>

                        {/* Booking Info */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-2">Booking Details</h4>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-gray-600">Service:</span> {booking.service.name}</p>
                                <p><span className="text-gray-600">Date:</span> {formatDate(booking.slot.startTime)}</p>
                                <p><span className="text-gray-600">Time:</span> {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}</p>
                                <p><span className="text-gray-600">Price:</span> ₹{booking.service.price}</p>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="w-4 h-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Reason Text Area */}
                        <div className="space-y-2">
                            <label htmlFor="reason" className="text-sm font-medium">
                                Cancellation Reason (Optional)
                            </label>
                            <Textarea
                                id="reason"
                                placeholder="Tell us why you're cancelling (3-500 characters)..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={loading}
                                className="resize-none h-24"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500">
                                {reason.length}/500 characters
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 cursor-pointer"
                            >
                                Keep Booking
                            </Button>
                            <Button
                                onClick={handleCancelBooking}
                                disabled={loading}
                                className="flex-1 cursor-pointer bg-red-600"
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {loading ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
