import { prisma } from "lib/prisma";
import { ServiceDefinitionInput, ServiceInput, SlotInput } from "@/schemas/services.schema";

export const bookService = async (data: ServiceInput, userId: string) => {
    const service = await prisma.serviceBooking.create({
        data: {
            ...data,
            userId,
        },
    });
    return service;
};

export const getServiceSlotsAvailable = async () => {
    const currentDateTime = new Date();
    // Get all future slots including their bookings count
    const slots = await prisma.slot.findMany({
        where: {
            // startTime: { gte: currentDateTime },
        },
        include: {
            bookings: true, // include bookings to count them
        },
        orderBy: { startTime: "asc" },
    });

    // Filter slots with less than 1 bookings
    const availableSlots = slots.filter(slot => slot.bookings.length < 1);

    return availableSlots;
};

export const getServiceById = async (id: string, isAdmin: boolean) => {
    // if admin user, include all bookings, else include only slot and status
    const Bookings = isAdmin ? {
        include: {
            slot: true,
            status: true
        }
    } : {
        select: {
            slot: true,
            status: true
        }
    };
    const service = await prisma.serviceDefinition.findFirst({
        where: { isActive: true, id },
        include: {
            bookings: Bookings
        },
    });
    return service;
};

// currently not in use (in future soft delete may introduce)
export const deleteService = async (id: string, userId?: string) => {
    const service = await prisma.serviceBooking.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!service) {
        throw new Error("Service not found or you don't have permission to delete it.");
    }

    await prisma.serviceBooking.delete({
        where: { id },
    });
};

export const getAllServices = async (take: number, skip: number, userId?: string) => {
    // If userId is provided, filter services by user
    console.log(`Take: ${take}, Skip: ${skip}`);
    const services = await prisma.serviceBooking.findMany({
        where: userId ? { userId } : {},
        take,
        skip,
        include: {
            user: true,
            slot: true,
            service: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return services;
};

export const getTotalServicesCount = async (userId?: string) => {
    const count = await prisma.serviceBooking.count({
        where: userId ? { userId } : {},
    });
    return count;
};

enum ServiceStatus {
    PENDING = "PENDING",
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export const updateStatus = async (serviceId: string, status: string, userId?: string) => {
    const upperStatus = status.toUpperCase();
    if (!(upperStatus in ServiceStatus)) {
        throw new Error(`Invalid status: ${status}`);
    }

    const service = await prisma.serviceBooking.findFirst({
        where: {
            id: serviceId,
            ...(userId && { userId }),
        },
    });

    if (!service) {
        throw new Error("Service not found or permission denied.");
    }

    const updatedService = await prisma.serviceBooking.update({
        where: { id: serviceId },
        data: { status: upperStatus as ServiceStatus },
    });

    return updatedService;
};

export const getAllPublicService = async (take: number, skip: number) => {
    const services = await prisma.serviceDefinition.findMany({
        where: { isActive: true },
        take,
        skip
    });
    return services;
};

export const addServiceDefinition = async (data: ServiceDefinitionInput, userId: string) => {
    const service = await prisma.serviceDefinition.create({
        data: {
            ...data,
            createdBy: { connect: { id: userId } },
        },
    });
    return service;
};

export const addSlot = async (data: SlotInput, userId: string) => {
    const slot = await prisma.slot.create({ data });
    return slot;
};

export const deleteSlot = async (id: string) => {
    const slot = await prisma.slot.findUnique({
        where: { id },
    });

    if (!slot) {
        throw new Error("Slot not found");
    }
    // transaction , if any bookings in this slots, then can not be delete
    const bookings = await prisma.serviceBooking.findMany({
        where: { slotId: id },
    });
    if (bookings.length > 0) {
        throw new Error("Cannot delete slot with existing bookings");
    }
    await prisma.slot.delete({
        where: { id },
    });

    return slot;
};