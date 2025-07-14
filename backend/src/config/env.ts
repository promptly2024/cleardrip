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