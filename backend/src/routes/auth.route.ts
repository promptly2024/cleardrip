import { AdminSignInHandler, AdminGetAllListHandler, CreateAdminUserHandler } from "@/controllers/auth/auth.admin.controller"
import { meHandler } from "@/controllers/auth/auth.me.controller"
import { signinHandler, signoutHandler, signupHandler, forgotPasswordHandler, resetPasswordHandler, updateProfileHandler } from "@/controllers/auth/auth.user.controller"
import { requireRole } from "@/middleware/requireRole"
import { FastifyInstance } from "fastify"

export default async function authRoutes(fastify: FastifyInstance) {
    // Public user routes
    fastify.post("/signup", signupHandler)
    fastify.post("/signin", signinHandler)
    fastify.post("/signout", signoutHandler)
    fastify.post("/user/forgot-password", forgotPasswordHandler)
    fastify.post("/user/reset-password", resetPasswordHandler)

    // Authenticated user routes
    fastify.post("/update-profile", { preHandler: requireRole(["USER"]) }, updateProfileHandler)
    fastify.get("/me", { preHandler: requireRole(["USER", "ADMIN", "SUPER_ADMIN"]) }, meHandler)

    // Admin routes
    fastify.post("/admin/signin", AdminSignInHandler)
    fastify.post("/admin/create", { preHandler: requireRole(["SUPER_ADMIN"]) }, CreateAdminUserHandler)
    fastify.get("/admin/list", { preHandler: requireRole(["SUPER_ADMIN"]) }, AdminGetAllListHandler)
}
