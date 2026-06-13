export interface OrganizationSummary {
  id: string
  name: string
  plan: string
  memberCount: number
  createdAt: string
}

export interface ExecutionMetrics {
  totalExecutions: number
  running: number
  success: number
  failed: number
  successRate: number
  avgDuration: number
}

export interface ExecutionItem {
  id: string
  status: "success" | "failed" | "running" | "queued"
  workflowName: string
  startedAt: string
  completedAt: string | null
}

export interface WorkflowItem {
  id: string
  name: string
  status: "active" | "draft" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface WorkflowSummary {
  total: number
  active: number
  draft: number
}
