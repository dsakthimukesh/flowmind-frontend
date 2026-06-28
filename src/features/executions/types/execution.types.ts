export interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED"
  startedAt: string
  completedAt: string | null
  duration: number | null // duration in milliseconds
  errorMessage?: string | null
}

export interface ExecutionLog {
  id: string
  timestamp?: string
  createdAt?: string
  nodeId?: string | null
  level: "INFO" | "WARN" | "ERROR"
  message: string
}

export interface ExecutionMetrics {
  total: number
  running: number
  success: number
  failed: number
  successRate: number // decimal value, e.g. 0.95
}
