import { FastifyInstance } from 'fastify'
import swaggerPlugin from './swagger'
import corsPlugin from './cors'
import cookiePlugin from './cookie'
import formbodyPlugin from './formbody'

export default async function registerPlugins(app: FastifyInstance) {
    await corsPlugin(app)
    await cookiePlugin(app)
    await formbodyPlugin(app)
    await swaggerPlugin(app)
}
