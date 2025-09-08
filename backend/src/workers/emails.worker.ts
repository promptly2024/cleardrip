export const notificationWorkerName = "notificationWorker";
import { Job, Worker } from "bullmq";
import { logger } from "@/lib/logger";
import { redisConnection } from "@/config/queue";
import { emailQueueName } from "@/queues/email.queue";
import { sendEmail } from "@/lib/email/sendEmail";

export const notificationWorker = new Worker(
    emailQueueName,
    async (job: Job) => {
        console.log(`\n\n\nProcessing notification job: ${job.id}`);
        logger.info(`Processing notification job: ${job.id}`);
        try {
            const { to, subject, message, html } = job.data;
            if (!to || !subject || !message) {
                throw new Error("Invalid job data: to, subject, and message are required");
            }
            await sendEmail(to, subject, message, html);
        } catch (error: any) {
            throw new Error(`Unsupported notification type: ${error.message}`);
        }
    },
    {
        connection: redisConnection
    }
); 