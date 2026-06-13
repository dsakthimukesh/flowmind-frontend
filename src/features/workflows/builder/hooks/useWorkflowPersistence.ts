import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createWorkflowVersion } from "../../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const useSaveWorkflowVersion = (workflowId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()
  const nodes = useWorkflowBuilderStore((state) => state.nodes)
  const edges = useWorkflowBuilderStore((state) => state.edges)

  return useMutation({
    mutationFn: () =>
      createWorkflowVersion(workflowId, {
        definition: { nodes, edges },
      }),
    onSuccess: () => {
      toast.success("Workflow version saved successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.versions(workflowId) })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to save workflow version"
      toast.error(errMsg)
    },
  })
}
