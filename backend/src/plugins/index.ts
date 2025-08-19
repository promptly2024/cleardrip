import { FastifyInstance } from 'fastify'
import swaggerPlugin from './swagger'
import corsPlugin from './cors'
import cookiePlugin from './cookie'
import formbodyPlugin from './formbody'
import redisPlugin from './redis'

export default async function registerPlugins(app: FastifyInstance) {
    await corsPlugin(app)
    await cookiePlugin(app)
    await formbodyPlugin(app)
    await swaggerPlugin(app)
    // await redisPlugin(app)
}
