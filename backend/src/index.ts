import { PORT } from './config/env';
import { buildApp } from './app';
import { closeWorkers, initWorkers } from './workers';

const start = async () => {
    const fastify = await buildApp();

    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`\n\n🚀\n Server is running on http://localhost:${PORT}`);
        
        initWorkers();
        
        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n⚠️  ${signal} received, shutting down gracefully...`);
            await closeWorkers();
            await fastify.close();
            process.exit(0);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
