import { useQuery } from "@tanstack/react-query"
import { getWorkflowVersion } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useWorkflowVersion = (workflowId: string, versionId: string) => {
  return useQuery({
    queryKey: queryKeys.workflows.version(workflowId, versionId),
    queryFn: () => getWorkflowVersion(workflowId, versionId),
    enabled: !!workflowId && !!versionId,
  })
}
