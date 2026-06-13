import { z } from "zod"

export const createKnowledgeBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),
})

export type CreateKnowledgeBaseInput = z.infer<typeof createKnowledgeBaseSchema>
