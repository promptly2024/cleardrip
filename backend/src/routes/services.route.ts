import { FastifyInstance } from "fastify"
import { requireRole } from "@/middleware/requireRole"
import { BookServiceHandler, DeleteServiceHandler, GetAllServicesHandler, GetServiceByIdHandler, GetServiceSlotsAvailableHandler, UpdateStatusHandler } from "@/controllers/services.controller"

export default async function servicesRoutes(fastify: FastifyInstance) {
    fastify.post("/services/book", { preHandler: requireRole(["USER"]) }, BookServiceHandler)
    fastify.get("/services/slots", GetServiceSlotsAvailableHandler)
    fastify.get("/services", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, GetAllServicesHandler)
    fastify.get("/services/:id", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, GetServiceByIdHandler)
    fastify.put("/services/:id/status", { preHandler: requireRole(["ADMIN", "SUPER_ADMIN"]) }, UpdateStatusHandler)
    fastify.delete("/services/:id", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, DeleteServiceHandler)
}