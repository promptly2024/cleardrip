import { z } from "zod"

export const serviceSchema = z.object({
  slotId: z.string().uuid().refine((id) => !!id, {
    message: "Invalid Slot Id.",
  }),
  serviceId: z.string().uuid().refine((id) => !!id, {
    message: "Invalid Service Id.",
  }),
  beforeImageUrl: z.string().url().optional(),
  afterImageUrl: z.string().url().optional(),
})

export const statusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]),
});

export type ServiceInput = z.infer<typeof serviceSchema>