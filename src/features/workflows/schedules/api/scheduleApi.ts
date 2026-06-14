import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import { type WorkflowSchedule, type CreateScheduleRequest } from "../types/schedule.types"

export const getSchedules = async (
  workflowId: string
): Promise<ApiResponse<WorkflowSchedule[]>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/workflows/${workflowId}/schedules`
  )
  return {
    ...response.data,
    data: response.data.data.schedules,
  }
}

export const createSchedule = async (
  workflowId: string,
  data: CreateScheduleRequest
): Promise<ApiResponse<WorkflowSchedule>> => {
  const response = await apiClient.post<ApiResponse<any>>(
    `/v1/workflows/${workflowId}/schedules`,
    data
  )
  return {
    ...response.data,
    data: response.data.data.schedule,
  }
}

export const deleteSchedule = async (
  workflowId: string,
  scheduleId: string
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/v1/workflows/${workflowId}/schedules/${scheduleId}`
  )
  return response.data
}
