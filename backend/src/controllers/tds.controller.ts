import { tdsSchema } from "@/schemas/tds.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { sendError } from "@/utils/errorResponse";
import { getRecentTDSLogs, logNewTDS } from "@/services/tds.service";
import { parsePagination } from "@/utils/parsePagination";
import { isAdmin } from "@/utils/auth";

export const LogNewTDSHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = tdsSchema.safeParse(req.body);
    if (!parsed.success) {
        return sendError(reply, 400, "Invalid TDS data", parsed.error);
    }
    const tdsData = parsed.data;
    const userId = req.user?.userId;
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }
    try {
        const newTDS = await logNewTDS(tdsData, userId);
        // if the tds is more than 
        // SendNotification();
        return reply.send(newTDS);
    } catch (error) {
        return sendError(reply, 500, "Failed to log TDS", error);
    }
}

export const GetRecentTDSHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    const { take, skip } = parsePagination(req.query);
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }
    const isAdminUser = isAdmin(req.user?.role);
    try {
        const tdsLogs = await getRecentTDSLogs(isAdminUser ? undefined : userId, take, skip);
        return reply.send(tdsLogs);
    } catch (error) {
        return sendError(reply, 500, "Failed to retrieve TDS logs", error);
    }
}

export const GetTDSByUserIdHandler = async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    const userId = req.params.userId;
    const { take, skip } = parsePagination(req.query);
    if (!userId) {
        return sendError(reply, 400, "User ID is required");
    }
    try {
        const tdsLogs = await getRecentTDSLogs(userId, take, skip);
        return reply.send({
            userId,
            tdsLogs,
            pagination: {
                take,
                skip,
                total: tdsLogs.length,
                hasMore: take + skip < tdsLogs.length,
            },
        });
    } catch (error) {
        return sendError(reply, 500, "Failed to retrieve TDS logs for user", error);
    }
}