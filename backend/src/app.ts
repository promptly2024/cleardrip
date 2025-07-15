import { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import registerPlugins from './plugins'
import authRoutes from './routes/auth.route'
import productRoutes from './routes/product.route'

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = Fastify({ logger: true })
    await registerPlugins(app)

    app.register(authRoutes, { prefix: '/api/auth' })
    app.register(productRoutes, { prefix: '/api' })

    return app
}
