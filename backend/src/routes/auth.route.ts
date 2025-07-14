import { FastifyInstance } from "fastify"
import { signupHandler } from "../controllers/auth.controller"

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/auth/signup", signupHandler)
}
