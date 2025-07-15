import { z } from "zod";

export const tdsSchema = z.object({
    tdsValue: z.number().int().min(0, "TDS value must be a non-negative integer"),
    timestamp: z.string().optional(),
});

export type TDSInput = z.infer<typeof tdsSchema>;