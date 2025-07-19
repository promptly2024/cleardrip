// File: backend/src/middleware/requireRole.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { verifyToken } from "../utils/jwt"

type Role = 'ADMIN' | 'USER' | 'SUPER_ADMIN'

// Extend FastifyRequest to include user property
declare module "fastify" {
    interface FastifyRequest {
        user?: {
            userId: string
            email: string
            role: Role
        }
    }
}

export function requireRole(allowedRoles: Role[]) {
    return async function (req: FastifyRequest, reply: FastifyReply) {
        const token = req.cookies?.admin_token || req.cookies?.user_token
        console.log(`\n\nReq.Cookies : ${JSON.stringify(req.cookies)}\n\n`);
        if (!token) {
            return reply.code(401).send({ error: "You must be logged in to access this resource." })
        }

        try {
            const decoded = verifyToken(token) as {
                userId: string
                email: string
                role: Role
            }

            if (!allowedRoles.includes(decoded.role)) {
                return reply.code(403).send({ error: `Forbidden: Requires role(s): ${allowedRoles.join(", ")}` })
            }

            req.user = decoded // Attach user info to request object
        } catch {
            return reply.code(401).send({ error: "Unauthorized: Invalid token" })
        }
    }
}
