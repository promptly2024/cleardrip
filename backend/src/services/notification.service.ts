import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// Define the type for the notification input
type NotificationInput = {
    userId: string;
    type: NotificationType;
    message: string;
};

export const SaveNotification = async (notification: NotificationInput): Promise<ReturnType<typeof prisma.notification.create>> => {
    return prisma.notification.create({
        data: {
            userId: notification.userId,
            type: notification.type,
            message: notification.message,
            status: "PENDING",
            sentAt: null,
            createdAt: new Date(),
        }
    });
};