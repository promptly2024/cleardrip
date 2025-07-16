import { notificationQueue, notificationQueueName } from "@/queues/notification.queue";
import { getAllUsersId } from "@/services/user.service";
import { sendError } from "@/utils/errorResponse";
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

    // Add the job to the notification queue
    await notificationQueue.add(notificationQueueName, {
        userId,
        type,
        payload
    });

    return reply.status(202).send({ message: "Notification job added to the queue" });
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

        return reply.status(202).send({ message: "Notification jobs added to the queue for specified users" });
    } catch (error) {
        return sendError(reply, 500, "Failed to send batch notifications", error);
    }
}