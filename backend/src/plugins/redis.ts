// File: backend/src/plugins/redis.ts

import { REDIS_URL } from '@/config/env';
import { FastifyInstance } from 'fastify';
import IORedis from 'ioredis';

export default async function redisPlugin(app: FastifyInstance) {
    const connection = new IORedis(REDIS_URL);
    app.decorate('redis', connection);
}
