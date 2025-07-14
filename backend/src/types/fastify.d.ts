// backend/src/types/fastify.d.ts
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

export { }; // This is to ensure that the FastifyRequest type is extended with the user property
// Now it is a module and the FastifyRequest type is properly extended