import { prisma } from "@/lib/prisma"
import { SubscriptionPlanType } from "@/schemas/subscriptionSchema";
import { Decimal } from "@prisma/client/runtime/library";

export const getSubscription = async (userId: string) => {
    return await prisma.subscription.findFirst({
        where: { userId, status: "CONFIRMED" },
        include: { plan: true },
    });
}

export const createSubscription = async (userId: string, planId: string) => {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan)
        throw new Error("Subscription plan not found.");

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    return await prisma.subscription.create({
        data: {
            userId,
            planId,
            startDate,
            endDate,
            status: "PENDING",
        },
        include: { plan: true },
    });
}

export const getAllSubscriptionsPlans = async () => {
    return await prisma.subscriptionPlan.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const createSubscriptionPlans = async (data: SubscriptionPlanType) => {
    return await prisma.subscriptionPlan.create({
        data: {
            name: data.name,
            description: data.description,
            price: new Decimal(data.price),
            duration: data.duration,
        },
    });
};

export const getSubscriptionPlanById = async (id: string) => {
    return await prisma.subscriptionPlan.findUnique({
        where: { id },
    });
};

export const deleteSubscriptionById = async (id: string) => {
    return await prisma.subscriptionPlan.delete({
        where: { id },
    });
}

export const isSubscriptionPlanUsed = async (planId: string) => {
    const count = await prisma.subscription.count({
        where: { planId },
    });
    return count > 0;
}

export const toggleSubscriptionPlanActiveStatus = async (planId: string, isActive: boolean) => {
    return await prisma.subscriptionPlan.update({
        where: { id: planId },
        data: { isActive },
    });
}