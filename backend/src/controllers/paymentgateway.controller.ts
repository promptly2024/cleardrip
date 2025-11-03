// backend/src/controllers/paymentgateway.controller.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { razorpay } from "../utils/razorpay"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export const createOrder = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId, purpose, productId, serviceId, subscriptionPlanId } = req.body as any

        // Map purpose to Prisma enum
        let prismaPurpose: "SERVICE_BOOKING" | "PRODUCT_PURCHASE" | "SUBSCRIPTION" | "OTHER"

        switch (purpose) {
            case "SERVICE":
                prismaPurpose = "SERVICE_BOOKING"
                break
            case "PRODUCT":
                prismaPurpose = "PRODUCT_PURCHASE"
                break
            case "SUBSCRIPTION":
                prismaPurpose = "SUBSCRIPTION"
                break
            default:
                return reply.code(400).send({ error: "Invalid payment purpose" })
        }

        // Fetch the amount based on purpose
        let amount = 0

        if (purpose === "PRODUCT") {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            })
            if (!product) return reply.code(404).send({ error: "Product not found" })
            amount = product.price
        }

        if (purpose === "SERVICE") {
            const service = await prisma.serviceDefinition.findUnique({
                where: { id: serviceId },
            })
            if (!service) return reply.code(404).send({ error: "Service not found" })
            amount = service.price ?? 0
        }

        if (purpose === "SUBSCRIPTION") {
            const plan = await prisma.subscriptionPlan.findUnique({
                where: { id: subscriptionPlanId },
            })
            if (!plan) return reply.code(404).send({ error: "Subscription plan not found" })
            amount = plan.price
        }

        if (amount <= 0) {
            return reply.code(400).send({ error: "Invalid amount for payment" })
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // convert to paisa
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        // Save PaymentOrder in DB
        const paymentOrder = await prisma.paymentOrder.create({
            data: {
                razorpayOrderId: order.id,
                amount,
                userId,
                purpose: prismaPurpose,
                productId: productId ?? null,
                bookingId: serviceId ?? null,
                subscriptionId: subscriptionPlanId ?? null,
            },
        })

        return reply.code(201).send({ order, paymentOrder })
    } catch (err: unknown) {
        req.log.error(err)
        const details = err instanceof Error ? err.message : String(err)
        return reply.code(500).send({ error: "Failed to create order", details })
    }
}

export const verifyPayment = async (req: FastifyRequest, reply: FastifyReply) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as any

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        const transaction = await prisma.paymentTransaction.create({
            data: {
                orderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "SUCCESS",
            },
        })
        await prisma.paymentOrder.update({
            where: { razorpayOrderId: razorpay_order_id },
            data: { status: "SUCCESS" },
        })
        return reply.send({ success: true, transaction })
    } else {
        return reply.code(400).send({ success: false, message: "Signature verification failed" })
    }
}
