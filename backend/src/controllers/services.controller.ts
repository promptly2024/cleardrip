import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { cancelSchema, rescheduleSchema, serviceDefinitionSchema, serviceSchema, slotSchema, statusSchema } from "@/schemas/services.schema";
import { addServiceDefinition, addSlot, bookService, cancelService, deleteService, deleteSlot, getAllPublicService, getAllServices, getAllSlots, getServiceById, getServiceSlotsAvailable, getTotalServicesCount, rescheduleService, updateStatus } from "@/services/services.service";
import { parsePagination } from "@/utils/parsePagination";
import { isAdmin } from "@/utils/auth";
import { sendError } from "@/utils/errorResponse";
import { uploadToCloudinary } from "@/utils/uploadToClaudinary";
import { parseMultipartData } from "@/utils/parseMultipartData";
import z from "zod";

export const BookServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    // console.log(`\n\nReq.User : ${JSON.stringify(req.user)}\n\n`);
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }

    try {
        let serviceData
        const { files, fields } = await parseMultipartData(req);
        if (files.length > 0) {
            console.log(`Received ${files.length} files.`);
            if (files.length > 1) return sendError(reply, 400, "Only one file is allowed", "Invalid request");

            const parsed = serviceSchema.safeParse(fields);
            if (!parsed.success) {
                return sendError(reply, 400, "Validation failed", parsed.error.issues);
            }
            let uploaded;
            if (!(files.length === 0)) {
                console.log("Uploading to Claudinary...");
                uploaded = await uploadToCloudinary({
                    files,
                    folder: "service_images",
                    filenamePrefix: `service_${userId}`,
                });
                console.log("Uploaded to Claudinary...");
            } else console.log("Creating service without image...");
            serviceData = {
                ...parsed.data,
                beforeImageUrl: uploaded && uploaded[0].url,
            };
            console.log(`Image Uploaded: ${uploaded && uploaded[0].url}`);
        } else {
            const parsed = serviceSchema.safeParse(fields);
            if (!parsed.success) {
                return sendError(reply, 400, "Validation failed", parsed.error.issues);
            }
            serviceData = parsed.data;
            console.log("No files uploaded, proceeding without image...");
        }
        console.log("Service data to be booked:", serviceData);

        const service = await bookService(serviceData, userId);

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
        const service = await getServiceById(id, isAdminUser);
        if (!service) {
            return sendError(reply, 404, "Service not found", `No service found with the provided ID: ${id}\nUser ID: ${userId}\nAdmin User: ${isAdminUser}`);
        }
        return reply.send({
            message: "Service retrieved successfully",
            service
        });
    } catch (error) {
        console.error("Failed to retrieve service:", error);
        return sendError(reply, 500, "Failed to retrieve service", error);
    }
}

export const GetServiceSlotsAvailableHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const slots = await getServiceSlotsAvailable();
        return reply.send({
            message: "Available slots retrieved successfully",
            slots
        });
    } catch (error) {
        console.error("Failed to retrieve service slots:", error);
        return sendError(reply, 500, "Failed to retrieve service slots", error);
    }
}

export const GetAllSlotsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const slots = await getAllSlots();
        return reply.send({
            message: "All slots retrieved successfully",
            slots
        });
    } catch (error) {
        console.error("Failed to retrieve all slots:", error);
        return sendError(reply, 500, "Failed to retrieve all slots", error);
    }
};

export const GetAllServicesHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { take, skip } = parsePagination(req.query);
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }
    console.log(`\n\nFetching all services for user: ${userId}\n\n`);
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
    } catch (error: any) {
        console.error("Failed to retrieve services:", error);
        // return sendError(reply, 500, error.message, "Failed to retrieve services");
        return sendError(reply, 500, "API Error", "API Error");
    }
}

export const getAllPublicServices = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { take, skip } = parsePagination(req.query);
        const services = await getAllPublicService(take, skip);
        return reply.send({
            message: "Public services retrieved successfully",
            services
        });
    } catch (error) {
        console.error("Failed to retrieve public services:", error);
        return sendError(reply, 500, "Failed to retrieve public services", error);
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

export const AddServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = serviceDefinitionSchema.safeParse(req.body);
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!parsed.success) {
        return sendError(reply, 400, "Invalid service data", "Invalid request");
    }
    const serviceData = parsed.data;
    try {
        if (!userId || !isAdminUser) {
            return sendError(reply, 403, "Forbidden", "You do not have permission to add a service");
        }
        const newService = await addServiceDefinition(serviceData, userId);
        return reply.send({
            message: "Service added successfully",
            service: newService
        });
    } catch (error: any) {
        return sendError(reply, 500, error.message, "Failed to add service");
    }
}

export const AddSlotHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = slotSchema.safeParse(req.body);
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    if (!parsed.success) {
        return sendError(reply, 400, "Invalid slot data", "Invalid request");
    }

    const slotData = parsed.data;
    try {
        if (!userId || !isAdminUser) {
            return sendError(reply, 403, "Forbidden", "You do not have permission to add a slot");
        }

        const newSlot = await addSlot(slotData);
        return reply.send({
            message: "Slot added successfully",
            slot: newSlot.inserted
        });
    } catch (error: any) {
        console.log(error);
        return sendError(reply, 500, error.message, "Failed to add slot");
    }
}

export const DeleteSlotHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    const isAdminUser = isAdmin(req.user?.role);
    const body = req.body as { slotIds: string | string[] };
    const slotIds = Array.isArray(body.slotIds) ? body.slotIds : [body.slotIds];
    if (!slotIds.length) {
        return sendError(reply, 400, "Slot ID is required", "Invalid request");
    }
    if (!userId || !isAdminUser) {
        return sendError(reply, 403, "Forbidden", "You do not have permission to delete a slot");
    }
    try {
        const { deleted, notDeleted } = await deleteSlot(slotIds);
        return reply.send({
            message: ` ${deleted.length} Slots deleted successfully`,
            deletedSlot: deleted,
            notDeletedSlot: notDeleted
        });
    } catch (error: any) {
        return sendError(reply, 422, error.message || "Failed to delete slot", error);
    }
}

export const RescheduleServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.userId;
    
    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }

    const parsed = rescheduleSchema.safeParse(req.body);

    if (!parsed.success) {
        return sendError(reply, 400, "Validation failed", parsed.error.issues);
    }

    const { slotId } = parsed.data;

    try {
        const rescheduledBooking = await rescheduleService(id, slotId, userId);
        
        return reply.send({
            message: "Service rescheduled successfully",
            booking: rescheduledBooking
        });
    } catch (error: any) {
        console.error("Failed to reschedule service:", error);
        return sendError(reply, 500, error.message || "Failed to reschedule service", error);
    }
};

export const CancelServiceHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.userId;

    if (!userId) {
        return sendError(reply, 401, "Unauthorized", "User ID is required");
    }

    const parsed = cancelSchema.safeParse(req.body);

    if (!parsed.success) {
        return sendError(reply, 400, "Validation failed", parsed.error.issues);
    }

    try {
        const cancelledBooking = await cancelService(id, userId, parsed.data.reason);
        
        return reply.send({
            message: "Service cancelled successfully",
            booking: cancelledBooking
        });
    } catch (error: any) {
        console.error("Failed to cancel service:", error);
        return sendError(reply, 500, error.message || "Failed to cancel service", error);
    }
};
