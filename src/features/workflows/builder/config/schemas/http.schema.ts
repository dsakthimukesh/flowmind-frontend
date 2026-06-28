import { z } from "zod"

export const httpNodeSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  headers: z.union([z.string(), z.record(z.any())]).optional().nullable(),
  body: z.union([z.string(), z.record(z.any())]).optional().nullable(),
})

export type HttpNodeValues = z.infer<typeof httpNodeSchema>
