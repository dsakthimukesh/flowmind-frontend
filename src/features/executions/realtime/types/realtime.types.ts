export interface ExecutionStartedEvent {
  executionId: string
  workflowId: string
  startedAt: string
}

export interface ExecutionRunningEvent {
  executionId: string
  status: "RUNNING"
}

export interface ExecutionCompletedEvent {
  executionId: string
  status: "SUCCESS"
  completedAt: string
}

export interface ExecutionFailedEvent {
  executionId: string
  status: "FAILED"
  error: string
}

export interface ExecutionLogEvent {
  executionId: string
  timestamp: string
  nodeId?: string | null
  level: "INFO" | "WARN" | "ERROR"
  message: string
}
