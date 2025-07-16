export const notificationWorkerName = "notificationWorker";
import { Job, Worker } from "bullmq";
import { notificationQueueName } from "@/queues/notification.queue";
import { logger } from "@/lib/logger";
import { redisConnection } from "@/config/queue";
import { sendFCM } from "@/services/notification/fcm.service";
import { sendWhatsAppNotification } from "@/services/notification/whatsapp.service";

export const notificationWorker = new Worker(
    notificationQueueName,
    async (job: Job) => {
        console.log(`\n\n\nProcessing notification job: ${job.id}`);
        logger.info(`Processing notification job: ${job.id}`);
        try {
            const { userId, type, payload } = job.data;
            if (!userId || !type || !payload) {
                throw new Error("Invalid job data: userId, type, and payload are required");
            }
            if (type === "push") {
                await sendFCM(userId, payload.title, payload.message);
            } else if (type === "whatsapp") {
                await sendWhatsAppNotification(userId, payload.message);
            }
            else {
                throw new Error(`Unsupported notification type: ${type}`);
            }
            logger.info(`\n\nNotification sent successfully for job: ${job.id} \n Title: ${payload.title} \n Message: ${payload.message}`);
        } catch (error) {
            logger.error(`\nError processing notification job ${job.id}: ${(error as Error).message}`);
            throw error; // Re-throw to mark the job as failed
        }
    },
    {
        connection: redisConnection
    }
);