import { prisma } from "@/lib/prisma"

export const getSubscription = async (userId: string) => {
    return await prisma.subscription.findFirst({
        where: { userId: userId }
    })
}

// Will Improve this later to handle different plans and durations
export const createSubscription = async (userId: string, planType: string) => {
    return await prisma.subscription.create({
        data: {
            userId: userId,
            planType,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
    })
}
/*
model Subscription {
  id           String   @id @default(uuid())
  user         User     @relation(fields: [userId], references: [id])
  userId       String
  planType     String // e.g. "Monthly", "Annual", etc.
  startDate    DateTime
  endDate      DateTime
  loyaltyBadge String? // optional display badge
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
*/