// src/app.ts
import Fastify from 'fastify';

const buildApp = () => {
    const fastify = Fastify({ logger: true });

    // Register routes

    return fastify;
};

export default buildApp;
