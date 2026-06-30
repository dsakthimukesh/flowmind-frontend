import { z } from "zod"

export const promptNodeSchema = z.object({
  prompt: z.string().min(1, "Prompt text is required"),
  outputKey: z.string().optional(),
})

export type PromptNodeValues = z.infer<typeof promptNodeSchema>
