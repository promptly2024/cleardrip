import { prisma } from "@/lib/prisma";
import { TDSInput } from "@/schemas/tds.schema";

export const logNewTDS = async (tdsData: TDSInput, userId: string) => {
    const newTDS = await prisma.tDSLog.create({
        data: {
            userId,
            tdsValue: tdsData.tdsValue,
            timestamp: tdsData.timestamp ? new Date(tdsData.timestamp) : new Date(),
        },
    });
    return newTDS;
};

export const getRecentTDSLogs = async (userId?: string, take?: number, skip?: number) => {
    const tdsLogs = await prisma.tDSLog.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take,
        skip,
    });
    return tdsLogs;
}