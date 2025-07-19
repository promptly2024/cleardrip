import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { serviceSchema, statusSchema } from "@/schemas/services.schema";
import { createService, deleteService, getAllServices, getServiceById, getTotalServicesCount, updateService, updateStatus } from "@/services/services.service";
import { parsePagination } from "@/utils/parsePagination";
import { isAdmin } from "@/utils/auth";
import { sendError } from "@/utils/errorResponse";
import { uploadToCloudinary } from "@/utils/uploadToClaudinary";
import { parseMultipartData } from "@/utils/parseMultipartData";

export const BookServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    console.log(`\n\nReq.User : ${JSON.stringify(req.user)}\n\n`);
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }

    try {
        const { files, fields } = await parseMultipartData(req);

        if (files.length > 1) return sendError(reply, 400, "Only one file is allowed", "Invalid request");

        const parsed = serviceSchema.safeParse(fields);
        if (!parsed.success) {
            return sendError(reply, 400, "Validation failed", parsed.error.issues);
        }
        let uploaded;
        if (!(files.length === 0)) {
            console.log("Creating service without image...");
            uploaded = await uploadToCloudinary({
                files,
                folder: "service_images",
                filenamePrefix: `service_${userId}`,
            });
            console.log("Uploaded to Claudinary...");
        } else console.log("Creating service without image...");

        const serviceData = {
            ...parsed.data,
            beforeImageUrl: uploaded && uploaded[0].url,
        };

        const service = await createService(serviceData, userId);

        return reply.code(201).send({
            message: "Service booked successfully",
            service
        });
    } catch (error) {
        console.error("Service booking failed:", error);
        return sendError(reply, 500, "Failed to book service", error);
    }
};

export const GetServiceByIdHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!id) {
        return sendError(reply, 400, "Service ID is required", "Invalid request");
    }
    try {
        const service = await getServiceById(id, isAdminUser ? undefined : userId);
        if (!service) {
            return sendError(reply, 404, "Service not found", "No service found with the provided ID");
        }
        return reply.send({
            message: "Service retrieved successfully",
            service
        });
    } catch (error) {
        return sendError(reply, 500, "Failed to retrieve service", error);
    }
}

export const GetAllServicesHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { take, skip } = parsePagination(req.query);
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }
    try {
        let services, totalServices;
        if (isAdminUser) {
            services = await getAllServices(take, skip);
            totalServices = await getTotalServicesCount();
        } else {
            services = await getAllServices(take, skip, userId);
            totalServices = await getTotalServicesCount(userId);
        }
        return reply.send({
            message: services.length > 0 ? "Services retrieved successfully" : "No services found",
            services,
            pagination: {
                take,
                skip,
                total: totalServices,
                hasNext: skip + take < totalServices,
            }
        });
    } catch (error) {
        return sendError(reply, 500, "Failed to retrieve services", error);
    }
}

export const UpdateStatusHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = statusSchema.safeParse(req.body);

    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!id || !parsed.success) {
        return sendError(reply, 400, "Service ID and status are required", "Invalid request");
    }
    const { status } = parsed.data;
    try {
        const updatedService = await updateStatus(id, status, isAdminUser ? undefined : userId);
        return reply.send({
            message: "Service status updated successfully",
            service: updatedService
        });
    } catch (error) {
        return sendError(reply, 500, "Failed to update service status", error);
    }
}

export const DeleteServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!id) {
        return sendError(reply, 400, "Service ID is required", "Invalid request");
    }
    try {
        const deletedService = await updateStatus(id, "CANCELLED", isAdminUser ? undefined : userId);
        return reply.send({
            message: "Service deleted successfully",
            service: deletedService
        });
    } catch (error) {
        return sendError(reply, 422, "Failed to delete service", error);
    }
}