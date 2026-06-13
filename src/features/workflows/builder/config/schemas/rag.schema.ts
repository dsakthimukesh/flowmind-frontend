import { z } from "zod"

export const ragQueryNodeSchema = z.object({
  knowledgeBaseId: z.string().min(1, "Knowledge base ID is required"),
  query: z.string().min(1, "Query is required"),
})

export type RagQueryNodeValues = z.infer<typeof ragQueryNodeSchema>
