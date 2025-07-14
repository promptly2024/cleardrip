// utils/errorResponse.ts
import { FastifyReply } from 'fastify'

export function sendError(reply: FastifyReply, statusCode: number, message: string, details?: unknown) {
    return reply.code(statusCode).send({ error: message, details })
}
