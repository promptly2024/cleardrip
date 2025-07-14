import buildApp from './app';
import { PORT } from './config/env';

const start = async () => {
    const fastify = buildApp();

    try {
        await fastify.listen({ port: PORT });
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
