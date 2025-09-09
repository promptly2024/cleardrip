// backend/src/controllers/auth.controller.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { logger } from "@/lib/logger"
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema, updatePasswordSchema, updateUserSchema } from "@/schemas/auth.schema"
import { createUser, findAndUpdateUser, findUserByEmailOrPhone, updateUserFCMToken, updateUserPassword } from "@/services/user.service";
import { removeAuthCookie, setAuthCookie } from "@/utils/cookies";
import { sendError } from "@/utils/errorResponse";
import { generateToken } from "@/utils/jwt";
import { comparePassword } from "@/utils/hash";
import { ZodError } from "zod";
import { UserSignUpTemplate } from "@/lib/email/template";
import { emailQueue, emailQueueName } from "@/queues/email.queue";

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

        if (user.email) {
            // Send welcome email using the email queue
            await emailQueue.add(emailQueueName, {
                to: user.email,
                subject: "Welcome to ClearDrip!",
                message: `Hello ${user.name}, welcome to ClearDrip!`,
                html: UserSignUpTemplate(user.name, user.email)
            });
        }
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
        const user = await findUserByEmailOrPhone(body.email, undefined, "USER");
        if (!user) {
            return reply.code(404).send({ error: "Invalid credentials" })
        }
        const isPasswordvalid = await comparePassword(body.password, user.password)
        if (!isPasswordvalid) {
            return reply.code(401).send({ error: "Invalid credentials" })
        }
        const token = generateToken({ userId: user.id, email: user.email, role: "USER" })
        setAuthCookie(reply, token, "USER")
        const { password, ...safeUser } = user
        return reply.code(200).send({
            message: "Signin successful",
            user: safeUser
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(reply, 400, "Validation error", error.issues)
        }
        logger.error(error, "Signin error")
        return sendError(reply, 400, "Signin failed", error)
    }
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

export const updateProfileHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = req.user
        if (!user) {
            return reply.code(401).send({ error: "Unauthorized" })
        }
        const body = updateUserSchema.safeParse(req.body)
        if (!body.success) {
            return sendError(reply, 400, "Validation error", body.error.issues)
        }

        // Update user profile logic
        const updatedUser = await findAndUpdateUser(user.userId, body.data)
        const { password, ...safeUser } = updatedUser
        return reply.code(200).send({
            message: "Profile updated successfully",
            user: safeUser
        })
    } catch (error) {
        logger.error(error, "Update profile error")
        return sendError(reply, 500, "Update profile failed", error)
    }
}

export const updatePassword = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = req.user
        if (!user) {
            return reply.code(401).send({ error: "Unauthorized" })
        }
        const body = updatePasswordSchema.safeParse(req.body)
        if (!body.success) {
            return sendError(reply, 400, "Validation error", body.error.issues)
        }

        // Update user password logic
        const updatedUser = await updateUserPassword(user.userId, body.data.newPassword)
        const { password, ...safeUser } = updatedUser
        return reply.code(200).send({
            message: "Password updated successfully",
            user: safeUser
        })
    } catch (error) {
        logger.error(error, "Update password error")
        return sendError(reply, 500, "Update password failed", error)
    }
}

export const updateFCMTokenHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = req.user;
        if (!user) {
            return sendError(reply, 400, "Unauthorised");
        }
        const { fcmToken } = req.body as { fcmToken: string };
        if (!fcmToken) {
            return sendError(reply, 400, "FCM token is required");
        }

        // Update user's FCM token
        const updatedUser = await updateUserFCMToken(user.userId, fcmToken);
        return reply.code(200).send({
            message: "FCM token updated successfully",
            user: updatedUser
        });
    } catch (error) {
        logger.error(error, "\nUpdate FCM token error");
        return sendError(reply, 500, "Update FCM token failed", error);
    }
}