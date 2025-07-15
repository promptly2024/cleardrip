import { z } from "zod"

export const serviceSchema = z.object({
  type: z.enum(["AMC", "URGENT"], { message: "Invalid service type" }),
  scheduledDate: z.date(),
  beforeImageUrl: z.string().url().optional(),
  afterImageUrl: z.string().url().optional(),
})

export const statusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]),
});

export type ServiceInput = z.infer<typeof serviceSchema>