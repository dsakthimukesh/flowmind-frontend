import { useQuery } from "@tanstack/react-query"
import { getExecutionMetrics } from "../api/executionApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useExecutionMetrics = () => {
  return useQuery({
    queryKey: queryKeys.executions.metrics,
    queryFn: getExecutionMetrics,
  })
}
