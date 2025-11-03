import { razorpay } from "@/utils/razorpay"
import { logger } from "./logger"
import crypto from "crypto"

export async function createRazorpayOrder(totalAmount: number) {

    // Ensure Razorpay secret/config present
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        logger.error("Razorpay credentials missing")
        throw new Error("Razorpay credentials missing in environment variables")
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    })
    return razorpayOrder
}

export async function fetchRazorpayOrder(orderId: string) {
    // Ensure Razorpay secret/config present
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        logger.error("Razorpay credentials missing")
        throw new Error("Razorpay credentials missing in environment variables")
    }
    const razorpayOrder = await razorpay.orders.fetch(orderId)
    return razorpayOrder
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(`${orderId}|${paymentId}`)
        .digest("hex")

    return generatedSignature === signature
}