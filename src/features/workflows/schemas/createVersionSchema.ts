import { z } from "zod"

export const createVersionSchema = z.object({
  definition: z.record(z.string(), z.any()),
})

export type CreateVersionValues = z.infer<typeof createVersionSchema>
