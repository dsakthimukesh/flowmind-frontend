import { useQuery } from "@tanstack/react-query"
import { getExecutionMetrics } from "../api/dashboardApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: getExecutionMetrics,
  })
}
