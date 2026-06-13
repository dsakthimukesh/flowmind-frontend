import { z } from "zod"

export const transformNodeSchema = z.object({
  template: z.string().min(1, "Transformation template is required"),
})

export type TransformNodeValues = z.infer<typeof transformNodeSchema>
