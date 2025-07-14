// src/app.ts
import Fastify from 'fastify';
import authRoutes from '@/routes/auth.route';
import fastifyCookie from "@fastify/cookie"
import { COOKIE_SECRET } from '@/config/env';
import productRoutes from '@/routes/product.route';

const buildApp = () => {
    const fastify = Fastify({ logger: true });

    fastify.register(import('@fastify/formbody'))
    fastify.register(import('@fastify/cors'))
    fastify.register(fastifyCookie, {
        secret: COOKIE_SECRET,
    });

    // Register routes
    fastify.register(authRoutes, { prefix: "/api" })
    fastify.register(productRoutes, { prefix: "/api" })

    return fastify;
};

export default buildApp;
