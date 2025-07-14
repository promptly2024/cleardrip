// types/fastify.d.ts
import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            userId: string
            email: string
            role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
        }
    }
}
