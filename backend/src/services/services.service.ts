import { prisma } from "lib/prisma";
import { ServiceInput } from "@/schemas/services.schema";

export const createService = async (data: ServiceInput, userId: string) => {
    // In case of urgent service, default time can be after 30 minutes - 2 hours from now, can be pass from frontend.
    const service = await prisma.service.create({
        data: {
            ...data,
            user: {
                connect: { id: userId }, // Associate the service with the user
            },
        },
    });
    return service;
};

export const getServiceById = async (id: string, userId?: string) => {
    // If userId is provided, filter service by user, else allow admin to access any service
    const service = await prisma.service.findFirst({
        where: userId ? { id, userId } : { id },
        include: {
            user: true, // Include user details if needed
        },
    });
    return service;
};

export const updateService = async (id: string, data: Partial<ServiceInput>) => {
    const service = await prisma.service.update({
        where: { id },
        data,
    });
    return service;
};

export const deleteService = async (id: string, userId?: string) => {
    const service = await prisma.service.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!service) {
        throw new Error("Service not found or you don't have permission to delete it.");
    }

    await prisma.service.delete({
        where: { id },
    });
};

export const getAllServices = async (take: number, skip: number, userId?: string) => {
    // If userId is provided, filter services by user
    const services = await prisma.service.findMany({
        where: userId ? { userId } : {},
        take,
        skip,
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return services;
};

export const getTotalServicesCount = async (userId?: string) => {
    const count = await prisma.service.count({
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

    const service = await prisma.service.findFirst({
        where: {
            id: serviceId,
            ...(userId && { userId }),
        },
    });

    if (!service) {
        throw new Error("Service not found or permission denied.");
    }

    const updatedService = await prisma.service.update({
        where: { id: serviceId },
        data: { status: upperStatus as ServiceStatus },
    });

    return updatedService;
};
