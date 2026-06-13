import { useQuery } from "@tanstack/react-query"
import { getRecentExecutions } from "../api/dashboardApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useRecentExecutions = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.executions,
    queryFn: getRecentExecutions,
  })
}
