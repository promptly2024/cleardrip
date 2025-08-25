import { FastifyInstance } from "fastify"
import { requireRole } from "@/middleware/requireRole"
import { CreateSubscriptionDetailsHandler, GetAllSubscriptionsDetailsHandler, GetCurrentSubscriptionPlanHandler, SubscribeToPlanHandler } from "@/controllers/subscription.controller"

export default async function subscriptionRoutes(fastify: FastifyInstance) {
    fastify.get("/subscriptions/all", GetAllSubscriptionsDetailsHandler)
    fastify.get("/subscriptions/current", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, GetCurrentSubscriptionPlanHandler)
    fastify.post("/subscriptions/subscribe", { preHandler: requireRole(["USER"]) }, SubscribeToPlanHandler)
    fastify.post("/subscriptions/create", { preHandler: requireRole(["ADMIN", "SUPER_ADMIN"]) }, CreateSubscriptionDetailsHandler)
}