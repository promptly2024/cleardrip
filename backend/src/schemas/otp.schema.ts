import { z } from "zod"

export const requestOtpSchema = z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
}).refine(data => data.phone || data.email, {
    message: "Either phone or email is required",
    path: ["_global"],
})
export type RequestOtpInput = z.infer<typeof requestOtpSchema>

export const verifyOtpSchema = z.object({
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    otp: z.string().length(6),
}).refine(data => data.phone || data.email, {
    message: "Either phone or email is required",
    path: ["_global"],
})
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>