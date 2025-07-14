// File: backend/src/middleware/requireRole.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { verifyToken } from "../utils/jwt"

type Role = 'ADMIN' | 'USER' | 'SUPER_ADMIN'

export function requireRole(role: Role) {
    return async function (req: FastifyRequest, reply: FastifyReply) {
        const token = req.cookies?.admin_token || req.cookies?.user_token

        if (!token) {
            return reply.code(401).send({ error: "Unauthorized: Token missing" })
        }
        
        if (!['ADMIN', 'USER', 'SUPER_ADMIN'].includes(role)) {
            return reply.code(403).send({ error: "Forbidden: Invalid role" })
        }

        try {
            const decoded = verifyToken(token) as {
                userId: string
                email: string
                role: Role
            }

            if (decoded.role !== role) {
                return reply.code(403).send({ error: `Forbidden: ${role} access required` })
            }

            req.user = decoded // Add decoded info to request
        } catch {
            return reply.code(401).send({ error: "Unauthorized: Invalid token" })
        }
    }
}
