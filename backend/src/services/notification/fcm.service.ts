// src/services/fcm.service.ts
import admin from "firebase-admin";
import { prisma } from "@/lib/prisma";

export async function sendFCM(userId: string, title: string, body: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("User not found");
    if (!user.fcmToken) throw new Error("FCM token not found");

    await admin.messaging().send({
        token: user.fcmToken,
        notification: { title, body },
    });
}

export async function sendBatchFCM(userIds: string[], title: string, body: string) {
    const users = await prisma.user.findMany({
        where: { id: { in: userIds }, fcmToken: { not: null } },
        select: { fcmToken: true },
    });

    if (users.length === 0) throw new Error("No valid FCM tokens found for the provided user IDs");

    const tokens = users.map(user => user.fcmToken!);

    // Send notification to each token individually
    await Promise.all(tokens.map(token =>
        admin.messaging().send({
            token,
            notification: { title, body },
        })
    ));
}