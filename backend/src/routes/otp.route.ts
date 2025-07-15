import { requestOtpHandler, verifyOtpHandler } from "@/controllers/auth/auth.otp.controller"
import { FastifyInstance } from "fastify"

export default async function otpRoutes(fastify: FastifyInstance) {
    fastify.post("/otp/request", requestOtpHandler);
    fastify.post("/otp/verify", verifyOtpHandler);
}