import { logger } from "@/lib/logger";
import { getSubscription } from "@/services/subscription.service";
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
            success: true,
            data: subscription,
        });
    } catch (error) {
        logger.error(error);
        return sendError(res, 500, "Internal server error.");
    }
}