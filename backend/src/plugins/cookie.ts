import { FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { COOKIE_SECRET } from '@/config/env'
import fastifyMultipart from '@fastify/multipart';

export default async function cookiePlugin(app: FastifyInstance) {
    await app.register(fastifyCookie, {
        secret: COOKIE_SECRET, // Used for signed cookies
        hook: 'onRequest',     // Registers cookie parser on request
    })
    await app.register(fastifyMultipart, {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        attachFieldsToBody: false,
    });

}
