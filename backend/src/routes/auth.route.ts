import { FastifyInstance } from "fastify"
import { forgotPasswordHandler, resetPasswordHandler, signinHandler, signoutHandler, signupHandler } from "../controllers/auth.user.controller"
import { meHandler } from "../controllers/auth.me.controller"
import { requireRole } from "../middleware/requireRole"

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/auth/signup", signupHandler)
    fastify.post("/auth/signin", signinHandler)
    fastify.post("/auth/signout", signoutHandler)
    fastify.post("/auth/forgot-password", forgotPasswordHandler)
    fastify.post("/auth/reset-password", resetPasswordHandler)
    fastify.get("/auth/me", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, meHandler)
}
