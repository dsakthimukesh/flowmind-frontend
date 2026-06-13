import { z } from "zod"

export const delayNodeSchema = z.object({
  seconds: z.coerce.number().positive("Delay seconds must be greater than 0"),
})

export type DelayNodeValues = z.infer<typeof delayNodeSchema>
