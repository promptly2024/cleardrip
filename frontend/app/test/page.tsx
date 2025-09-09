"use client";
import { APIURL } from '@/utils/env';
import React from 'react'

const Test = () => {
    const [payload, setPayload] = React.useState("Test message from frontend by Rohit");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [userid, setUserid] = React.useState('fefe1131-f6c8-47da-9622-8d040b057988');
    const [success, setSuccess] = React.useState<string | null>(null);
    const [apiResponse, setApiResponse] = React.useState<any>(null);
    type NotificationType = 'FCM' | 'WHATSAPP' | 'EMAIL';

    React.useEffect(() => {
        setError(null);
        setSuccess(null);
    }, [payload, userid]);

    const sendNotification = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            setApiResponse(null);
            const response = await fetch(`${APIURL}/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId: userid,
                    type: 'WHATSAPP', // FCM
                    payload: {
                        title: 'Test Notification',
                        message: payload,
                    },
                }),
            });
            const data = await response.json();

            setApiResponse(data);
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send notification');
            }
            setSuccess('Notification sent successfully!');
            console.log('Notification sent:', data);
        } catch (error) {
            setError('Error sending notification');
            console.error('Error sending notification:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-md">
            <h1 className="text-center text-2xl font-bold mb-6">Send Test Notification</h1>
            {apiResponse && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
            )}
            <div className="mb-4">
                <label className="block font-medium mb-1">User ID:</label>
                <input
                    type="text"
                    value={userid}
                    onChange={e => setUserid(e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full p-2 mt-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Message:</label>
                <textarea
                    value={payload}
                    onChange={e => setPayload(e.target.value)}
                    rows={3}
                    className="w-full p-2 mt-1 rounded border border-gray-300 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <button
                onClick={sendNotification}
                disabled={loading || !userid || !payload}
                className={`w-full py-2 rounded font-semibold text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    }`}
            >
                {loading ? 'Sending...' : 'Send Notification'}
            </button>
            {error && (
                <div className="text-red-600 mt-3 text-center">{error}</div>
            )}
            {success && (
                <div className="text-green-600 mt-3 text-center">{success}</div>
            )}
        </div>
    );
}

export default Test

/*
import { emailQueue, emailQueueName } from "@/queues/email.queue";
import { notificationQueue, notificationQueueName } from "@/queues/notification.queue";
import { SaveNotification } from "@/services/notification.service";
import { getAllUsersId } from "@/services/user.service";
import { sendError } from "@/utils/errorResponse";
import { NotificationType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

type NotificationBody = {
    userId: string;
    type: string;
    payload: {
        title: string;
        message: string;
    }
};

export const sendNotificationHandler = async (request: FastifyRequest, reply: FastifyReply) => {

    const { userId, type, payload } = request.body as NotificationBody;
    if (!userId || !type || !payload) {
        return sendError(reply, 400, "Invalid request: userId, type, and payload are required.");
    }

    // Validate notification type
    const validTypes = ['WHATSAPP', 'FCM', 'EMAIL'];
    if (!validTypes.includes(type)) {
        return sendError(reply, 400, `Invalid notification type. Allowed types are: ${validTypes.join(", ")}`);
    }

    // Validate payload (title is optional for WhatsApp)
    if (!payload.message) {
        return sendError(reply, 400, "Invalid request: payload.message is required.");
    }

    // Add the job to the notification queue
    if (type === "EMAIL") {
        await emailQueue.add(emailQueueName, {
            to: userId, // Here userId is actually email
            subject: payload.title || "Notification",
            message: payload.message,
            html: `<p>${payload.message}</p>`
        });
    } else {
        await notificationQueue.add(notificationQueueName, {
            userId,
            type,
            payload
        });
    }

    // Update the notification in DB
    const notification = {
        userId,
        type: type as NotificationType,
        message: payload.message,
        status: "PENDING",
        sentAt: null,
        createdAt: new Date()
    };

    // Save in db
    const savedNotification = await SaveNotification(notification);

    return reply.status(202).send({ message: "Notification job added to the queue", notification: savedNotification });
};

export const sendNotificationToAllHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { type, payload } = request.body as NotificationBody;
    if (!type || !payload) {
        return sendError(reply, 400, "Invalid request: type and payload are required.");
    }
    try {
        const users = await getAllUsersId();
        await Promise.all(
            users.map((userId: string) =>
                notificationQueue.add(notificationQueueName, {
                    userId,
                    type,
                    payload
                })
            )
        );
        // Update the notification in DB
        const notifications = users.map((userId: string) => ({
            userId,
            type: type as NotificationType,
            message: payload.message,
            status: "PENDING",
            sentAt: null,
            createdAt: new Date()
        }));
        // Save in db
        await Promise.all(
            notifications.map(notification => SaveNotification(notification))
        );

        return reply.status(202).send({ message: "Notification jobs added to the queue for all users" });
    } catch (error) {
        return sendError(reply, 500, "Failed to send notifications to all users", error);
    }
}

export const sendBatchNotificationHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { userIds, type, payload } = request.body as { userIds: string[], type: string, payload: { title: string, message: string } };
    if (!userIds || !type || !payload) {
        return sendError(reply, 400, "Invalid request: userIds, type, and payload are required.");
    }

    try {
        await Promise.all(
            userIds.map((userId) =>
                notificationQueue.add(notificationQueueName, {
                    userId,
                    type,
                    payload
                })
            )
        );
        // Update the notification in DB
        const notifications = userIds.map((userId) => ({
            userId,
            type: type as NotificationType,
            message: payload.message,
            status: "PENDING",
            sentAt: null,
            createdAt: new Date()
        }));
        // Save in db
        await Promise.all(
            notifications.map(notification => SaveNotification(notification))
        );

        return reply.status(202).send({ message: "Notification jobs added to the queue for specified users" });
    } catch (error) {
        return sendError(reply, 500, "Failed to send batch notifications", error);
    }
}
*/