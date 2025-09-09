"use server";
import { SMTP_HOST, SMTP_PASSWORD, SMTP_USER, FROM_EMAIL, FROM_NAME } from "@/config/env";
import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, message: string, html: string) => {

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });

    try {
        const uniqueId = Date.now(); // Unique ID for email
        const info = await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to: to,
            subject: subject,
            text: message,
            html: message,
            messageId: uniqueId.toString(),

            headers: {
                "X-Entity-Ref-ID": uniqueId.toString(),
                "X-Entity-Ref-Type": "email",
            },
            date: new Date(),
        });
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.error("Error sending email:", error);
        return { message: "Email sending failed", error: error };
    }

    return { message: "Email sent successfully", error: "" };
};

export default sendEmail;
export { sendEmail };