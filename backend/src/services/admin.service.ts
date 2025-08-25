import { prisma } from "@/lib/prisma";

export const findAdminByEmail = async (email: string) => {
    return await prisma.admin.findUnique({
        where: { email },
    });
}

export const findAllAdmins = async () => {
    return await prisma.admin.findMany();
}

export const createAdminUser = async (adminData: { email: string; password: string; name: string }) => {
    return await prisma.admin.create({
        data: adminData,
    });
}

export async function getStaffById(id: string) {
    const staff = await prisma.admin.findUnique({
        where: {
            id
        }
    });
    return staff;
}

export async function deleteStaffById(id: string){
    await prisma.admin.delete({
        where: {
            id
        }
    })
}