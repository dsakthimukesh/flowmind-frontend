import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createWorkflow } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useCreateWorkflow = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      toast.success("Workflow created successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.all })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to create workflow"
      toast.error(errMsg)
    },
  })
}
