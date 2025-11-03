import { cancelPayment, createOrder, verifyPayment } from "@/controllers/paymentgateway.controller"
import { requireRole } from "@/middleware/requireRole"
import { FastifyInstance } from "fastify"

export default async function paymentRoutes(fastify: FastifyInstance) {
    fastify.post("/order", { preHandler: requireRole(['USER']), handler: createOrder })
    fastify.post("/verify", { preHandler: requireRole(['USER']), handler: verifyPayment })
    fastify.post("/cancel", { preHandler: requireRole(['USER']), handler: cancelPayment })
}
