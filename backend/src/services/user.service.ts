// backend/src/controllers/auth.controller.ts
import { prisma } from "../lib/prisma"
import { SignupInput } from "../schemas/auth.schema"
import { hashPassword } from "../utils/hash"

export async function findUserByEmailOrPhone(email: string, phone?: string) {
    return prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { phone: phone }
            ]
        }
    })
}

export async function createUser(data: SignupInput) {
    const hashedPassword = await hashPassword(data.password)

    const address = await prisma.address.create({
        data: data.address
    })

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            addressId: address.id
        },
        include: { address: true }
    })
}
