import { createOrder, verifyPayment } from "@/controllers/paymentgateway.controller"
import { FastifyInstance } from "fastify"

export default async function paymentRoutes(fastify: FastifyInstance) {
    fastify.post("/order", createOrder)
    fastify.post("/verify", verifyPayment)
}
