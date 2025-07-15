import { logger } from "@/lib/logger";
import { requestOtpSchema, verifyOtpSchema } from "@/schemas/otp.schema";
import { generateAndSendOtp, verifyOtp } from "@/services/otp.service";
import { sendError } from "@/utils/errorResponse";
import { FastifyReply, FastifyRequest } from "fastify";

export const requestOtpHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = requestOtpSchema.safeParse(req.body);
    if (!body.success) {
        return sendError(reply, 400, "Validation error", body.error.issues);
    }
    try {
        const { phone, email } = body.data;
        if (!phone && !email) return sendError(reply, 400, "Email or Phone is required to send otp.");

        const isSuccess = await generateAndSendOtp(phone, email);
        if (isSuccess) return reply.code(200).send({ message: "OTP sent successfully" });
        else return sendError(reply, 500, "Failed to send OTP");
    } catch (error) {
        logger.error(error, "Request OTP error")
        return sendError(reply, 500, "Request OTP failed", error)
    }
}

export const verifyOtpHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = verifyOtpSchema.safeParse(req.body);
    if (!body.success) {
        return sendError(reply, 400, "Validation error", body.error.issues);
    }
    try {
        const { phone, email, otp } = body.data;
        if (!phone && !email) return sendError(reply, 2456, "Email or Phone is required to verify otp.");

        const isSuccess = await verifyOtp(otp, phone, email);
        if (isSuccess) return reply.code(200).send({ message: "OTP verified successfully" });
        else return sendError(reply, 500, "Failed to verify OTP");
    } catch (error) {
        logger.error(error, "Verify OTP error")
        return sendError(reply, 500, "Verify OTP failed", error)
    }
}