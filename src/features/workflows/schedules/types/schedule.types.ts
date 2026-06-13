export interface WorkflowSchedule {
  id: string
  workflowId: string
  cronExpression: string
  timezone: string
  status: "ENABLED" | "DISABLED"
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleRequest {
  cronExpression: string
  timezone: string
}
