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

export const serviceDefinitionSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500),
  image: z.string().url(),
  type: z.enum(["AMC", "URGENT"]),
  price: z.number().min(0),
  duration: z.number().min(1),
  isActive: z.boolean().default(true),
});

export type ServiceDefinitionInput = z.infer<typeof serviceDefinitionSchema>

export const slotSchema = z.array(z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
}));

export type SlotInput = z.infer<typeof slotSchema>;
