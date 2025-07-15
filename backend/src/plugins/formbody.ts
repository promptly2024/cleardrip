import { FastifyInstance } from 'fastify'
import formBody from '@fastify/formbody'

export default async function formbodyPlugin(app: FastifyInstance) {
    await app.register(formBody)
}
