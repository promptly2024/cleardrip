// src/utils/auth.ts

export const isAdmin = (role?: string): boolean => {
    return role === "ADMIN" || role === "SUPER_ADMIN";
};

export const isUser = (role?: string): boolean => {
    return role === "USER";
};

