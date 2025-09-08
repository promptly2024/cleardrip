import { prisma } from "@/lib/prisma";
import { encryptOtp, compareOtp } from "@/utils/auth";
import { findUserByEmailOrPhone } from "./user.service";
import { logger } from "@/lib/logger";
import { sendEmail } from "@/lib/email/sendEmail";

export const generateAndSendOtp = async (phone?: string, email?: string) => {
    if (!phone && !email) {
        throw new Error("Either phone or email must be provided");
    }

    // Will use better later
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Find user by phone or email
    const user = await findUserByEmailOrPhone(email, phone);

    if (!user) {
        throw new Error("User not found");
    }

    // TODO: Send OTP via SMS/Email
    console.log(`OTP for ${phone || email}: ${otp}`);
    if (email) {
        await sendEmail(
            email,
            "Your OTP Code",
            `Your OTP code is ${otp}. It is valid for 5 minutes.`,
            `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
        );
    } else {
        // Integrate with SMS service to send OTP
        logger.info(`Send OTP ${otp} to phone ${phone}`);
    }

    const encryptedOtp = await encryptOtp(otp);

    await prisma.oTPSession.create({
        data: {
            otpCode: encryptedOtp,
            channel: phone ? "PHONE" : "EMAIL",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            verified: false,
            user: {
                connect: { id: user.id }
            }
        }
    });

    return true;
};


export const verifyOtp = async (otp: string, phone?: string, email?: string) => {
    if (!otp || (!phone && !email)) {
        throw new Error("OTP and either phone or email must be provided");
    }

    const user = await findUserByEmailOrPhone(email, phone);

    if (!user) {
        throw new Error("User not found");
    }

    // Fetch the most recent unverified, unexpired OTP session
    const session = await prisma.oTPSession.findFirst({
        where: {
            userId: user.id,
            channel: phone ? "PHONE" : "EMAIL",
            verified: false,
            expiresAt: {
                gte: new Date()
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    if (!session) {
        throw new Error("Invalid or expired OTP");
    }

    const isMatch = await compareOtp(otp, session.otpCode);

    if (!isMatch) {
        throw new Error("Incorrect OTP");
    }

    await prisma.oTPSession.update({
        where: { id: session.id },
        data: { verified: true }
    });

    return true;
};
