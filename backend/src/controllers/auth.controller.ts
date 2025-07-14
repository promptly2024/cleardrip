// backend/src/controllers/auth.controller.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { signupSchema } from "../schemas/auth.schema"
import { ZodError } from "zod"
import { generateToken } from "../utils/jwt"
import { setAuthCookie } from "../utils/cookies"
import { createUser, findUserByEmailOrPhone } from "../services/user.service"
import { sendError } from "../utils/errorResponse"
import { logger } from "../lib/logger"

export const signupHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const body = signupSchema.parse(req.body)
        // Check if user already exists
        const existingUser = await findUserByEmailOrPhone(body.email, body.phone ? body.phone : undefined);
        if (existingUser) {
            return reply.code(400).send({ error: "User already exists with this email or phone number" })
        }
        // Create new user
        const user = await createUser(body);
        const { password, ...safeUser } = user;
        const token = generateToken({ userId: user.id, email: user.email, role: "USER" });
        setAuthCookie(reply, token, "USER")

        return reply.code(201).send({
            message: "Registration successful",
            user: safeUser
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(reply, 400, "Validation error", error.issues)
        }
        logger.error(error, "Signup error")
        return sendError(reply, 400, "Signup failed", error)
    }
}
