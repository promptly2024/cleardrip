import { adminCreateSchema, adminSignInSchema } from "@/schemas/auth.schema";
import { createAdminUser, findAdminByEmail, findAllAdmins } from "@/services/admin.service";
import { setAuthCookie } from "@/utils/cookies";
import { sendError } from "@/utils/errorResponse";
import { comparePassword } from "@/utils/hash";
import { generateToken } from "@/utils/jwt";
import { FastifyReply, FastifyRequest } from "fastify";


export const AdminSignInHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = adminSignInSchema.safeParse(req.body);
    if (!body.success) {
        return sendError(reply, 400, "Validation failed", body.error.issues);
    }
    try {
        const admin = await findAdminByEmail(body.data.email);
        if (!admin) {
            return sendError(reply, 404, "Admin not found", "No admin found with the provided email");
        }
        const isPasswordValid = await comparePassword(body.data.password, admin.password);
        if (!isPasswordValid) {
            return sendError(reply, 401, "Invalid password", "The provided password is incorrect");
        }
        const role = admin.role === "STAFF" ? "ADMIN" : "SUPER_ADMIN";
        const token = generateToken({ userId: admin.id, email: admin.email, role });
        setAuthCookie(reply, token, role);
        return reply.code(200).send({ message: "Admin signed in successfully" });
    } catch (error) {
        return sendError(reply, 500, "Failed to sign in admin", error);
    }
}

export const AdminGetAllListHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const admins = await findAllAdmins();
        return reply.code(200).send(admins);
    } catch (error) {
        return sendError(reply, 500, "Failed to fetch admin list", error);
    }
}

export const CreateAdminUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = adminCreateSchema.safeParse(req.body);
    if (!body.success) {
        return sendError(reply, 400, "Validation failed", body.error.issues);
    }
    try {
        const existingAdmin = await findAdminByEmail(body.data.email);
        if (existingAdmin) {
            return sendError(reply, 409, "Admin already exists", "An admin with this email already exists");
        }
        const newAdmin = await createAdminUser({
            email: body.data.email,
            password: body.data.password,
            name: body.data.name,
        });
        return reply.code(201).send(newAdmin);
    } catch (error) {
        return sendError(reply, 500, "Failed to create admin user", error);
    }
}