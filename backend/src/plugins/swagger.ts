import { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export default async function swaggerPlugin(app: FastifyInstance) {
    await app.register(swagger, {
        openapi: {
            info: {
                title: 'Cleardrip API',
                description: 'API documentation using Swagger',
                version: '1.0.0',
            },
            servers: [
                { url: 'http://localhost:3000', description: 'Local Dev' },
            ],
        },
    })

    await app.register(swaggerUI, {
        routePrefix: '/docs',
        uiConfig: { docExpansion: 'full', deepLinking: false },
    })
}
