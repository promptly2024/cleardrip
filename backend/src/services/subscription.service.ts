import { prisma } from "@/lib/prisma"
import { SubscriptionPlanType } from "@/schemas/subscriptionSchema";

export const getSubscription = async (userId: string) => {
    return await prisma.subscription.findFirst({
        where: { userId: userId },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
    })
}

// Will Improve this later to handle different plans and durations
export const createSubscription = async (userId: string, planId: string) => {
    // Get the plan details
    const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId }
    });
    if (!plan) {
        throw new Error("Invalid subscription plan.");
    }
    return await prisma.subscription.create({
        data: {
            userId: userId,
            planId,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + plan.duration))
        }
    })
}

export const getAllSubscriptionsPlans = async () => {
    return await prisma.subscriptionPlan.findMany({
        orderBy: { price: "asc" },
    });
};

export const createSubscriptionPlans = async (data: SubscriptionPlanType) => {
    return await prisma.subscriptionPlan.create({
        data: {
            name: data.name,
            price: data.price,
            duration: data.duration,
            description: data.description
        }
    });
};

export const deleteSubscriptionById = async (id: string) => {
    return await prisma.subscriptionPlan.delete({
        where: {
            id
        }
    })
}
