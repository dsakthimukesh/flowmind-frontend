import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/app/config/queryKeys"
import { createSchedule } from "../api/scheduleApi"
import { type CreateScheduleRequest } from "../types/schedule.types"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useCreateSchedule = (workflowId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => createSchedule(workflowId, data),
    onSuccess: () => {
      toast.success("Schedule created successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all(workflowId) })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to create schedule"
      toast.error(errMsg)
    },
  })
}
