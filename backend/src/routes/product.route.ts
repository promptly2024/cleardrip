import { createProductHandler, deleteProductHandler, getAllProductsHandler, getProductByIdHandler, updateProductHandler } from "@/controllers/product.controller"
import { FastifyInstance } from "fastify"
import { requireRole } from "@/middleware/requireRole"

export default async function productRoutes(fastify: FastifyInstance) {
    fastify.get("/products", getAllProductsHandler)
    fastify.get("/product/:id", getProductByIdHandler)

    fastify.post("/product", { preHandler: requireRole(["ADMIN", "SUPER_ADMIN"]) }, createProductHandler)
    fastify.put("/product/:id", { preHandler: requireRole(["ADMIN", "SUPER_ADMIN"]) }, updateProductHandler)
    fastify.delete("/product/:id", { preHandler: requireRole(["ADMIN", "SUPER_ADMIN"]) }, deleteProductHandler)
}