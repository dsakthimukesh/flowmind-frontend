import { useQuery } from "@tanstack/react-query"
import { getWorkflow } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useWorkflow = (id: string) => {
  return useQuery({
    queryKey: queryKeys.workflows.detail(id),
    queryFn: () => getWorkflow(id),
    enabled: !!id,
  })
}
