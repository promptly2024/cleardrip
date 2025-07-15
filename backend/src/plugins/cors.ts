import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

export default async function corsPlugin(app: FastifyInstance) {
    await app.register(cors, {
        origin: true, // or ['http://localhost:3000'] for strict origin
        credentials: true,
    })
}
