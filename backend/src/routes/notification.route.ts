import { sendBatchNotificationHandler, sendNotificationHandler, sendNotificationToAllHandler } from "@/controllers/notification.controller";
import { requireRole } from "@/middleware/requireRole";
import { FastifyInstance } from "fastify";

export default async function notificationRoute(fastify: FastifyInstance) {
    fastify.post("/notification", { preHandler: requireRole(["SUPER_ADMIN"]) }, sendNotificationHandler);
    fastify.post("/notification/all", { preHandler: requireRole(["SUPER_ADMIN"]) }, sendNotificationToAllHandler);
    fastify.post("/notification/batch", { preHandler: requireRole(["SUPER_ADMIN"]) }, sendBatchNotificationHandler);
}