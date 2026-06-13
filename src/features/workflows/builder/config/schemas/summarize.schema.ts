import { z } from "zod"

export const summarizeNodeSchema = z.object({
  maxLength: z.coerce.number().positive("Max length must be greater than 0"),
})

export type SummarizeNodeValues = z.infer<typeof summarizeNodeSchema>
