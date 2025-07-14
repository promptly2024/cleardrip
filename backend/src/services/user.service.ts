// backend/src/controllers/auth.controller.ts
import { prisma } from "../lib/prisma"
import { SignupInput } from "../schemas/auth.schema"
import { hashPassword } from "../utils/hash"

export async function findUserByEmailOrPhone(email: string, phone?: string, role: string = "USER") {
    if (role === 'USER') {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
                ]
            }
        })
    }
    return prisma.admin.findFirst({
        where: {
            OR: [
                { email: email }
            ]
        }
    })
}

export async function createUser(data: SignupInput) {
    const hashedPassword = await hashPassword(data.password)

    const result = await prisma.$transaction(async (tx) => {
        const address = await tx.address.create({
            data: data.address
        })

        return tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                addressId: address.id
            },
            include: { address: true }
        })
    })
    return result
}
