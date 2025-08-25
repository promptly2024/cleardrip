import z from "zod";

export const SubscriptionPlanSchema = z.object({
    name: z.string()
        .min(2, { message: "Plan name must be at least 2 characters long." })
        .max(100, { message: "Plan name cannot exceed 100 characters." }),

    price: z.number()
        .min(0, { message: "Price must be at least 0." }),

    duration: z.number()
        .min(1, { message: "Duration must be at least 1 day." }),

    description: z.string()
        .max(500, { message: "Description cannot exceed 500 characters." })
        .optional(),
});

export type SubscriptionPlanType = z.infer<typeof SubscriptionPlanSchema>;
