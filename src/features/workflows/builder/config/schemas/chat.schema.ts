import { z } from "zod"

export const chatNodeSchema = z.object({
  systemPrompt: z.string().min(1, "System prompt is required"),
  temperature: z.coerce.number().min(0, "Temperature must be at least 0").max(1, "Temperature cannot exceed 1"),
  outputKey: z.string().optional(),
})

export type ChatNodeValues = z.infer<typeof chatNodeSchema>
