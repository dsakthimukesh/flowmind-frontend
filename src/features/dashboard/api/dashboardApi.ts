import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type OrganizationSummary,
  type ExecutionMetrics,
  type ExecutionItem,
  type WorkflowItem,
} from "../types/dashboard.types"

export const getOrganizationSummary = async (): Promise<ApiResponse<OrganizationSummary>> => {
  const response = await apiClient.get<ApiResponse<OrganizationSummary>>("/v1/organizations/me")
  return response.data
}

export const getExecutionMetrics = async (): Promise<ApiResponse<ExecutionMetrics>> => {
  const response = await apiClient.get<ApiResponse<ExecutionMetrics>>("/v1/metrics/executions")
  return response.data
}

export const getRecentExecutions = async (): Promise<ApiResponse<ExecutionItem[]>> => {
  const response = await apiClient.get<ApiResponse<ExecutionItem[]>>("/v1/executions")
  return response.data
}

export const getWorkflows = async (): Promise<ApiResponse<WorkflowItem[]>> => {
  const response = await apiClient.get<ApiResponse<WorkflowItem[]>>("/v1/workflows")
  return response.data
}
