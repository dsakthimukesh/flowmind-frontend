export type WorkflowStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"

export interface WorkflowItem {
  id: string
  name: string
  description?: string
  status: WorkflowStatus
  createdAt: string
  updatedAt: string
  publishedVersionId?: string | null
}

export interface WorkflowVersion {
  id: string
  workflowId: string
  versionNumber: number
  isPublished: boolean
  definition: Record<string, any>
  createdAt: string
}

export interface CreateWorkflowRequest {
  name: string
  description?: string
}

export interface CreateVersionRequest {
  definition: Record<string, any>
}

export interface PublishWorkflowRequest {
  versionId: string
}
