import { useQuery } from "@tanstack/react-query"
import { getWorkflows } from "../api/workflowApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useWorkflows = () => {
  return useQuery({
    queryKey: queryKeys.workflows.all,
    queryFn: getWorkflows,
  })
}
