import { PORT } from '@/config/env';
import { buildApp } from './app';

const start = async () => {
    const fastify = await buildApp();

    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`\n\n🚀\n Server is running on http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
