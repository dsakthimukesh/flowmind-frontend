import { z } from "zod"

export const conditionNodeSchema = z.object({
  expression: z.string().min(1, "Expression is required"),
})

export type ConditionNodeValues = z.infer<typeof conditionNodeSchema>
