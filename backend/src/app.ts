import { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import registerPlugins from './plugins'
import authRoutes from './routes/auth.route'
import productRoutes from './routes/product.route'
import otpRoutes from './routes/otp.route'
import servicesRoutes from './routes/services.route'
import tdsRoutes from './routes/tds.route'
import notificationRoute from './routes/notification.route'
import './workers/notification.worker'
import subscriptionRoutes from './routes/subscription.route'

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = Fastify({ logger: true })
    await registerPlugins(app)

    app.register(authRoutes, { prefix: '/api/auth' })
    app.register(productRoutes, { prefix: '/api' })
    app.register(otpRoutes, { prefix: '/api/' })
    app.register(servicesRoutes, { prefix: '/api' })
    app.register(tdsRoutes, { prefix: '/api' })
    app.register(notificationRoute, { prefix: '/api' })
    app.register(subscriptionRoutes, { prefix: '/api' })

    return app
}
