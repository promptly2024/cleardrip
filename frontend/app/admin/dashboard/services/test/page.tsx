"use client";
import { APIURL } from '@/utils/env';
import React, { useCallback } from 'react'
import { toast } from 'sonner';

interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    bookings: Array<{
        id: string;
        userId: string;
        serviceId: string;
        slotId: string;
        status: string;
        beforeImageUrl: string;
        afterImageUrl: string;
        createdAt: string;
        updatedAt: string;
    }>;
    bookingCount: number;
}

const slotData: Slot = {
    id: "bfc94847-f8a0-4d4e-bff6-55616cfe0fed",
    startTime: "2025-08-27T04:34:00.000Z",
    endTime: "2025-08-27T05:35:00.000Z",
    createdAt: "2025-08-26T07:09:04.327Z",
    updatedAt: "2025-08-26T07:09:04.327Z",
    bookings: [
        {
            id: "6674ab41-8254-414c-8668-8cb9e3c62e35",
            userId: "11d9c1ed-2529-42a2-9c2d-7e10a618afba",
            serviceId: "a6e92812-d075-41c9-be74-f751f7f3efe2",
            slotId: "bfc94847-f8a0-4d4e-bff6-55616cfe0fed",
            status: "IN_PROGRESS",
            beforeImageUrl: "https://cloudinary.com/sample-before-1.jpg",
            afterImageUrl: "https://cloudinary.com/sample-after-1.jpg",
            createdAt: "2025-08-26T07:09:04.322Z",
            updatedAt: "2025-08-26T07:09:04.322Z"
        }
    ],
    bookingCount: 1
};

const page = () => { // Fetch slots
    const [slots, setSlots] = React.useState<any[]>([]);
    const [slotsLoading, setSlotsLoading] = React.useState(false);
    const fetchSlots = useCallback(async () => {
        setSlotsLoading(true);
        try {
            const response = await fetch(`${APIURL}/services/slots/all`, {// This api return all available slots in the future
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

    return (
        <div>
            <h1>Service Test Page</h1>
            <button onClick={fetchSlots} disabled={slotsLoading}>
                {slotsLoading ? "Loading..." : "Fetch Slots"}
            </button>
            {slots.length > 0 && (
                <ul>
                    {JSON.stringify(slots)}
                </ul>
            )}
        </div>
    )
}

export default page
