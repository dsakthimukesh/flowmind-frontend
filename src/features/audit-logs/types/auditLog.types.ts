export interface AuditLogActor {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

export interface AuditLogItem {
  id: string
  timestamp: string // ISO string
  action: string
  resourceType: string
  resourceId: string
  actor: AuditLogActor
  metadata: Record<string, any>
}

export interface AuditLogFilters {
  page: number
  pageSize: number
  action?: string
  actorId?: string // text search term for actor ID/email
  resourceType?: string
  dateRange?: "today" | "7days" | "30days" | "custom"
  dateFrom?: string // ISO date string
  dateTo?: string // ISO date string
}
