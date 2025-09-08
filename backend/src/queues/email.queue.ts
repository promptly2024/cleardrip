import { Queue } from "bullmq";
import { redisConnection, defaultQueueOptions } from "@/config/queue";

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions,
});