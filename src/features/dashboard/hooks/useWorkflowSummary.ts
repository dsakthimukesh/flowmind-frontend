import { useQuery } from "@tanstack/react-query"
import { getWorkflows } from "../api/dashboardApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type WorkflowSummary } from "../types/dashboard.types"

export const useWorkflowSummary = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.workflows,
    queryFn: getWorkflows,
    select: (response) => {
      const list = response.data || []
      const total = list.length
      const active = list.filter((w) => w.status === "active").length
      const draft = list.filter((w) => w.status === "draft").length

      return {
        ...response,
        summary: {
          total,
          active,
          draft,
        } as WorkflowSummary,
      }
    },
  })
}
