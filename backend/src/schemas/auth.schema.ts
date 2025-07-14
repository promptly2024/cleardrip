import { z } from "zod"

export const signupSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }).optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    address: z.object({
        street: z.string().min(1, { message: "Street is required" }),
        city: z.string().min(1, { message: "City is required" }),
        state: z.string().min(1, { message: "State is required" }),
        postalCode: z.string().min(1, { message: "Postal code is required" }),
        country: z.string().min(1, { message: "Country is required" }),
    }),
})

export type SignupInput = z.infer<typeof signupSchema>
