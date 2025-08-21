import { getContactUs, postContactUs } from "@/controllers/contactus.controller";
import { requireRole } from "@/middleware/requireRole";
import { FastifyInstance } from "fastify"

export default async function contactUsRoutes(fastify: FastifyInstance) {
    fastify.post("/contactus", postContactUs);
    fastify.get("/contactus", { preHandler: requireRole(['ADMIN', 'SUPER_ADMIN']) }, getContactUs); // only admins can access
}