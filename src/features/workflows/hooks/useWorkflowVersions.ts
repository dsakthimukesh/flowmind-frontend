import { useQuery } from "@tanstack/react-query"
import { getWorkflowVersions } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useWorkflowVersions = (workflowId: string) => {
  return useQuery({
    queryKey: queryKeys.workflows.versions(workflowId),
    queryFn: () => getWorkflowVersions(workflowId),
    enabled: !!workflowId,
  })
}
