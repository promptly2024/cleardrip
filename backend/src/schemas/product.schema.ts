import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    description: z.string().optional(),
    inventory: z.number().min(0, { message: "Inventory must be a non-negative integer" }),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export type ProductInput = z.infer<typeof productSchema>
export const productUpdateSchema = productSchema.partial();