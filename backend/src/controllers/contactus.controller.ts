import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "@/lib/logger";
import { sendError } from "@/utils/errorResponse";
import { createContact, getAllContacts } from "@/services/contactus.service";

export const getContactUs = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const contacts = await getAllContacts();
        return reply.code(200).send(contacts);
    } catch (error) {
        logger.error(error, "Get all contacts error");
        return sendError(reply, 500, "Get all contacts failed", error);
    }
};

export const postContactUs = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const contactData = req.body as {
            name: string;
            email: string;
            message: string;
        };
        const newContact = await createContact(contactData);
        return reply.code(201).send(newContact);
    } catch (error: any) {
        logger.error(error, "Post contact us error");
        return sendError(reply, 500, error.message, "An error occurred");
    }
};