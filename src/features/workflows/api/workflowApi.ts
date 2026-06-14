import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type WorkflowItem,
  type WorkflowVersion,
  type CreateWorkflowRequest,
  type CreateVersionRequest,
  type PublishWorkflowRequest,
} from "../types/workflow.types"

export const getWorkflows = async (): Promise<ApiResponse<WorkflowItem[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/workflows")
  return {
    ...response.data,
    data: response.data.data.workflows,
  }
}

export const createWorkflow = async (
  data: CreateWorkflowRequest,
): Promise<ApiResponse<WorkflowItem>> => {
  const response = await apiClient.post<ApiResponse<any>>("/v1/workflows", data)
  return {
    ...response.data,
    data: response.data.data.workflow,
  }
}

export const getWorkflow = async (id: string): Promise<ApiResponse<WorkflowItem>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/workflows/${id}`)
  return {
    ...response.data,
    data: response.data.data.workflow,
  }
}

export const getWorkflowVersions = async (id: string): Promise<ApiResponse<WorkflowVersion[]>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/workflows/${id}/versions`)
  return {
    ...response.data,
    data: response.data.data.versions,
  }
}

export const createWorkflowVersion = async (
  id: string,
  data: CreateVersionRequest,
): Promise<ApiResponse<WorkflowVersion>> => {
  const response = await apiClient.post<ApiResponse<any>>(
    `/v1/workflows/${id}/versions`,
    data,
  )
  return {
    ...response.data,
    data: response.data.data.version,
  }
}

export const getWorkflowVersion = async (
  workflowId: string,
  versionId: string,
): Promise<ApiResponse<WorkflowVersion>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/workflows/${workflowId}/versions/${versionId}`,
  )
  return {
    ...response.data,
    data: response.data.data.version,
  }
}

export const publishWorkflow = async (
  id: string,
  data: PublishWorkflowRequest,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/workflows/${id}/publish`, data)
  return {
    ...response.data,
    data: response.data.data.version,
  }
}
