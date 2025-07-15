import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

export default async function corsPlugin(app: FastifyInstance) {
    await app.register(cors, {
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
}
