import { useQuery } from "@tanstack/react-query"
import { getOrganizationSummary } from "../api/dashboardApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useOrganizationSummary = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.organization,
    queryFn: getOrganizationSummary,
  })
}
