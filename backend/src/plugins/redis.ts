import { REDIS_URL, REDIS_HOST, REDIS_PORT } from '../config/env';
import { FastifyInstance } from 'fastify';
import IORedis from 'ioredis';

export default async function redisPlugin(app: FastifyInstance) {
    const password = REDIS_URL.split('@')[0].split('://')[1].split(':')[1];
    
    const connection = new IORedis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: password,
        tls: {},
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });

    connection.on('connect', () => {
        console.log('Redis connected successfully');
    });

    connection.on('error', (err) => {
        console.error(' Redis connection error:', err);
    });

    connection.on('ready', () => {
        console.log('Redis is ready to accept commands');
    });

    app.decorate('redis', connection);

    // Graceful shutdown
    app.addHook('onClose', async () => {
        await connection.quit();
        console.log('Redis connection closed');
    });
}
