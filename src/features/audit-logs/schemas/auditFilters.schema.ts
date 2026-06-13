import { z } from "zod"

export const auditFiltersSchema = z.object({
  action: z.string().optional(),
  resourceType: z.string().optional(),
  actorId: z.string().optional(),
  dateRange: z.enum(["today", "7days", "30days", "custom"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type AuditFiltersInput = z.infer<typeof auditFiltersSchema>
