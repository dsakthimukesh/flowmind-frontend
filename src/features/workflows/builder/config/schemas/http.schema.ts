import { z } from "zod"

export const httpNodeSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  headers: z.string().optional(),
  body: z.string().optional(),
})

export type HttpNodeValues = z.infer<typeof httpNodeSchema>
