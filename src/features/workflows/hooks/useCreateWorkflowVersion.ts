import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createWorkflowVersion } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useCreateWorkflowVersion = (workflowId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (definition: Record<string, any>) =>
      createWorkflowVersion(workflowId, { definition }),
    onSuccess: () => {
      toast.success("Version created successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.versions(workflowId) })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to create version"
      toast.error(errMsg)
    },
  })
}
