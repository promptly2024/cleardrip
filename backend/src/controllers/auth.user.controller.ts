// backend/src/controllers/auth.controller.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema } from "../schemas/auth.schema"
import { ZodError } from "zod"
import { generateToken } from "../utils/jwt"
import { removeAuthCookie, setAuthCookie } from "../utils/cookies"
import { createUser, findUserByEmailOrPhone } from "../services/user.service"
import { sendError } from "../utils/errorResponse"
import { logger } from "../lib/logger"
import { comparePassword } from "../utils/hash"

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

export const signinHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const body = signinSchema.parse(req.body)
        const user = await findUserByEmailOrPhone(body.email)
        if (!user) {
            return reply.code(404).send({ error: "User not found" })
        }
        const isPasswordvalid = await comparePassword(body.password, user.password)
        if (!isPasswordvalid) {
            return reply.code(401).send({ error: "Invalid password" })
        }
        const token = generateToken({ userId: user.id, email: user.email, role: "USER" })
        setAuthCookie(reply, token, "USER")
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(reply, 400, "Validation error", error.issues)
        }
        logger.error(error, "Signin error")
        return sendError(reply, 400, "Signin failed", error)
    }
    return reply.code(200).send({ message: "Signin successful" })
}

export const signoutHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        removeAuthCookie(reply)
        return reply.code(200).send({ message: "Signout successful" })
    } catch (error) {
        logger.error(error, "Signout error")
        return sendError(reply, 500, "Signout failed", error)
    }
}

export const forgotPasswordHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email } = forgotPasswordSchema.parse(req.body)
        const user = await findUserByEmailOrPhone(email)
        if (!user) {
            return reply.code(404).send({ error: "User not found" })
        }
        // TODO: Implement password reset logic
        // const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        // const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
        // const hashedToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

        return reply.code(200).send({ message: "Password reset link sent" })
    } catch (error) {
        logger.error(error, "Forgot password error")
        return sendError(reply, 500, "Forgot password failed", error)
    }
}

export const resetPasswordHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { token, newPassword } = resetPasswordSchema.parse(req.body)
        // TODO: Implement password reset logic
    } catch (error) {
        logger.error(error, "Reset password error")
        return sendError(reply, 500, "Reset password failed", error)
    }
}
