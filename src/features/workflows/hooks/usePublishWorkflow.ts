import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { publishWorkflow } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const usePublishWorkflow = (workflowId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionId: string) => publishWorkflow(workflowId, { versionId }),
    onSuccess: () => {
      toast.success("Workflow published successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.detail(workflowId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.versions(workflowId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.all })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to publish workflow"
      toast.error(errMsg)
    },
  })
}
