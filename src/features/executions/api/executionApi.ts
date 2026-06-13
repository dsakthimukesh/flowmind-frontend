import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type WorkflowExecution,
  type ExecutionLog,
  type ExecutionMetrics,
} from "../types/execution.types"

export interface GetExecutionsParams {
  page?: number
  pageSize?: number
  workflowId?: string
}

export interface GetExecutionLogsParams {
  page?: number
  pageSize?: number
}

export const getExecutions = async (
  params?: GetExecutionsParams
): Promise<ApiResponse<WorkflowExecution[]>> => {
  const response = await apiClient.get<ApiResponse<WorkflowExecution[]>>("/v1/executions", {
    params: {
      page: params?.page,
      limit: params?.pageSize, // Use limit to map to backend's expectation or pageSize depending on mapping
      pageSize: params?.pageSize,
      workflowId: params?.workflowId,
    },
  })
  return response.data
}

export const getExecution = async (id: string): Promise<ApiResponse<WorkflowExecution>> => {
  const response = await apiClient.get<ApiResponse<WorkflowExecution>>(`/v1/executions/${id}`)
  return response.data
}

export const getExecutionLogs = async (
  id: string,
  params?: GetExecutionLogsParams
): Promise<ApiResponse<ExecutionLog[]>> => {
  const response = await apiClient.get<ApiResponse<ExecutionLog[]>>(`/v1/executions/${id}/logs`, {
    params: {
      page: params?.page,
      limit: params?.pageSize,
      pageSize: params?.pageSize,
    },
  })
  return response.data
}

export const getExecutionMetrics = async (): Promise<ApiResponse<ExecutionMetrics>> => {
  const response = await apiClient.get<ApiResponse<ExecutionMetrics>>("/v1/metrics/executions")
  return response.data
}
