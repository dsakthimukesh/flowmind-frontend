import { z } from "zod"

export const summarizeNodeSchema = z.object({
  maxLength: z.coerce.number().positive("Max length must be greater than 0"),
  outputKey: z.string().optional(),
})

export type SummarizeNodeValues = z.infer<typeof summarizeNodeSchema>
