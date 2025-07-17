import { logger } from "@/lib/logger";
import { createSubscription, getSubscription } from "@/services/subscription.service";
import { sendError } from "@/utils/errorResponse";
import { FastifyReply, FastifyRequest } from "fastify";

// View Current Subscription Plan
export const GetCurrentSubscriptionPlanHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const userId = req.user?.userId;
    if (!userId) {
        return sendError(res, 400, "Unauthorised request...");
    }
    try {
        const subscription = await getSubscription(userId);
        if (!subscription) {
            return sendError(res, 404, "No active subscription found.");
        }
        return res.status(200).send({
            message: "Current subscription plan retrieved successfully.",
            success: true,
            data: subscription,
        });
    } catch (error) {
        logger.error(error);
        return sendError(res, 500, "Internal server error.");
    }
}

export const SubscribeToPlanHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const userId = req.user?.userId;
    if (!userId) {
        return sendError(res, 400, "Unauthorised request...");
    }
    try {
        const subscription = await getSubscription(userId);
        if (subscription) {
            return sendError(res, 400, "User already has an active subscription.");
        }
        const newSubscription = await createSubscription(userId, "Monthly"); 
        // Will improve this later to handle different plans and durations
        if (!newSubscription) {
            return sendError(res, 400, "Failed to create subscription.");
        }
        return res.status(201).send({
            message: "Subscription created successfully.",
            success: true,
            data: newSubscription,
        });
    } catch (error) {
        logger.error(error);
        return sendError(res, 500, "Internal server error.");
    }
}