import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type OrganizationSummary,
  type ExecutionMetrics,
  type ExecutionItem,
  type WorkflowItem,
} from "../types/dashboard.types"

export const getOrganizationSummary = async (): Promise<ApiResponse<OrganizationSummary>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/organizations/me")
  return {
    ...response.data,
    data: response.data.data.organization,
  }
}

export const getExecutionMetrics = async (): Promise<ApiResponse<ExecutionMetrics>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/metrics/executions")
  const m = response.data?.data?.metrics
  return {
    ...response.data,
    data: {
      totalExecutions: m?.total || 0,
      running: m?.running || 0,
      success: m?.success || 0,
      failed: m?.failed || 0,
      successRate: m?.successRate ? m.successRate / 100 : 0,
      avgDuration: m?.avgDurationMs || 0,
    },
  }
}

export const getRecentExecutions = async (): Promise<ApiResponse<ExecutionItem[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/executions")
  return {
    ...response.data,
    data: response.data.data.executions,
  }
}

export const getWorkflows = async (): Promise<ApiResponse<WorkflowItem[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/workflows")
  return {
    ...response.data,
    data: response.data.data.workflows,
  }
}
