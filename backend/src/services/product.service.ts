import { prisma } from "@/lib/prisma";
import { ProductInput } from "@/schemas/product.schema";

export async function getAllProducts(take: number, skip: number) {
    const products = await prisma.product.findMany({
        take,
        skip
    });
    return products;
}

export async function getProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: { id }
    });
    return product;
}

export async function createProduct(data: ProductInput) {
    const product = await prisma.product.create({
        data
    });
    return product;
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    const product = await prisma.product.update({
        where: { id },
        data
    });
    return product;
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });
}