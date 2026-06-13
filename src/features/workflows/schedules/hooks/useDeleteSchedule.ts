import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/app/config/queryKeys"
import { deleteSchedule } from "../api/scheduleApi"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useDeleteSchedule = (workflowId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(workflowId, scheduleId),
    onSuccess: () => {
      toast.success("Schedule deleted successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all(workflowId) })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to delete schedule"
      toast.error(errMsg)
    },
  })
}
