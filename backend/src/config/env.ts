// src/config/env.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
