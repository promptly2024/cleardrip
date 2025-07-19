// src/config/env.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const JWT_SECRET = process.env.JWT_SECRET as string || (() => {
    throw new Error("JWT_SECRET not set in environment variables");
})();
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string || '7d';

export const COOKIE_SECRET = process.env.COOKIE_SECRET || (() => {
    throw new Error("COOKIE_SECRET not set in environment variables");
})();

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_URL = process.env.REDIS_URL || (() => {
    throw new Error("REDIS_URL not set in environment variables");
})();


export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || (() => {
    throw new Error("CLOUDINARY_CLOUD_NAME not set in environment variables");
})();

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || (() => {
    throw new Error("CLOUDINARY_API_KEY not set in environment variables");
})();

export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || (() => {
    throw new Error("CLOUDINARY_API_SECRET not set in environment variables");
})();