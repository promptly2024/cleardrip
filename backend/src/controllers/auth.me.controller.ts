import { FastifyRequest, FastifyReply } from "fastify"
import { findUserByEmailOrPhone } from "../services/user.service"
import { sendError } from "../utils/errorResponse"
import { logger } from "../lib/logger"

export const meHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = req.user
        if (!user) {
            return reply.code(401).send({ error: "Unauthorized" })
        }
        const existingUser = await findUserByEmailOrPhone(user.email, user.role)
        if (!existingUser) {
            return reply.code(404).send({ error: "User not found" })
        }
        const { password, ...safeUser } = existingUser
        return reply.code(200).send({
            message: "User info fetched successfully",
            role: user.role ? user.role : "USER",
            user: safeUser
        })
    } catch (error) {
        logger.error(error, "Me handler error")
        return sendError(reply, 500, "Failed to fetch user info", error)
    }
}