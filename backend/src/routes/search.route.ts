import { searchHandler } from "@/controllers/search.controller";
import { FastifyInstance } from "fastify"

export default async function searchRoutes(fastify: FastifyInstance) {
    fastify.post("/search", searchHandler);
}