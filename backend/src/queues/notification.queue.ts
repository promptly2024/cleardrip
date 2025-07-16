import { Queue } from "bullmq";
import { redisConnection, defaultQueueOptions } from "@/config/queue";

export const notificationQueueName = "notificationQueue";

export const notificationQueue = new Queue(notificationQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions,
});