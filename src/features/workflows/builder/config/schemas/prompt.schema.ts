import { z } from "zod"

export const promptNodeSchema = z.object({
  prompt: z.string().min(1, "Prompt text is required"),
})

export type PromptNodeValues = z.infer<typeof promptNodeSchema>
