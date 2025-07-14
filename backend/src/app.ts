// src/app.ts
import Fastify from 'fastify';
import authRoutes from '@/routes/auth.route';
import fastifyCookie from "@fastify/cookie"
import { COOKIE_SECRET } from '@/config/env';
import productRoutes from '@/routes/product.route';

const buildApp = () => {
    const fastify = Fastify({ logger: true });

    fastify.register(import('@fastify/formbody'))
    fastify.register(import('@fastify/cors'),  {
        origin: (origin, callback) => {
            const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
    fastify.register(fastifyCookie, {
        secret: COOKIE_SECRET,
    });

    // Register routes
    fastify.register(authRoutes, { prefix: "/api" })
    fastify.register(productRoutes, { prefix: "/api" })

    return fastify;
};

export default buildApp;
