import { useQuery } from "@tanstack/react-query"
import { getExecutions } from "../api/executionApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useExecutions = (page?: number, pageSize?: number, workflowId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.executions.all, page, pageSize, workflowId],
    queryFn: () => getExecutions({ page, pageSize, workflowId }),
    placeholderData: (previousData) => previousData,
  })
}
