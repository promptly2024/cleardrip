import { prisma } from "@/lib/prisma"

export const getSubscription = async (userId: string) => {
    return await prisma.subscription.findFirst({
        where: { userId: userId }
    })
}
