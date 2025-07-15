import { FastifyInstance } from "fastify"
import { requireRole } from "@/middleware/requireRole"
import { GetRecentTDSHandler, LogNewTDSHandler } from "@/controllers/tds.controller"

export default async function tdsRoutes(fastify: FastifyInstance) {
    // Logged-in users can log new TDS values.
    fastify.post("/tds/log", { preHandler: requireRole(["USER"]) }, LogNewTDSHandler);

    // Any logged-in user can retrieve their recent TDS logs or an admin can retrieve all users' logs.
    fastify.get("/tds/recent", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, GetRecentTDSHandler);

    // Admins can retrieve TDS logs for a specific user.
    fastify.get("/tds/recent/:userId?page=1&skip=1", { preHandler: requireRole(["ADMIN", "SUPER_ADMIN"]) }, GetRecentTDSHandler);
}