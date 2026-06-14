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
  const response = await apiClient.get<ApiResponse<any>>("/v1/executions", {
    params: {
      page: params?.page,
      limit: params?.pageSize,
      pageSize: params?.pageSize,
      workflowId: params?.workflowId,
    },
  })
  return {
    ...response.data,
    data: response.data.data.executions,
  }
}

export const getExecution = async (id: string): Promise<ApiResponse<WorkflowExecution>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/executions/${id}`)
  return {
    ...response.data,
    data: response.data.data.execution,
  }
}

export const getExecutionLogs = async (
  id: string,
  params?: GetExecutionLogsParams
): Promise<ApiResponse<ExecutionLog[]>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/executions/${id}/logs`, {
    params: {
      page: params?.page,
      limit: params?.pageSize,
      pageSize: params?.pageSize,
    },
  })
  return {
    ...response.data,
    data: response.data.data.logs,
    meta: {
      page: response.data.data.page,
      limit: response.data.data.pageSize,
      totalItems: response.data.data.total,
      totalPages: Math.ceil(response.data.data.total / (response.data.data.pageSize || 1)),
    },
  }
}

export const getExecutionMetrics = async (): Promise<ApiResponse<ExecutionMetrics>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/metrics/executions")
  return {
    ...response.data,
    data: response.data.data.metrics,
  }
}
