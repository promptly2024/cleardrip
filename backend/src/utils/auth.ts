// src/utils/auth.ts
import bcrypt from "bcryptjs";

export const isAdmin = (role?: string): boolean => {
    return role === "ADMIN" || role === "SUPER_ADMIN";
};

export const isUser = (role?: string): boolean => {
    return role === "USER";
};

export const isSuperAdmin = (role?: string): boolean => {
    return role === "SUPER_ADMIN";
};

export const encryptOtp = async (otp: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};

export const compareOtp = async (raw: string, hashed: string) => {
    return await bcrypt.compare(raw, hashed);
}