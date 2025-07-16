// File: backend/src/config/queue.ts
import { ConnectionOptions, DefaultJobOptions } from 'bullmq';
import { REDIS_HOST, REDIS_PORT } from './env';

export const redisConnection: ConnectionOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
}

export const defaultQueueOptions: DefaultJobOptions = {
    removeOnComplete: {
        age: 60 * 60, // Remove completed jobs after 1 hour
        count: 100, // Keep the last 100 completed jobs
    },
    attempts: 3, // Retry failed jobs up to 3 times
    backoff: {
        type: 'exponential', // Use exponential backoff for retries
        delay: 1000, // Initial delay of 1 second
    },
    removeOnFail: {
        age: 60 * 60, // Remove failed jobs after 1 hour
    },
}