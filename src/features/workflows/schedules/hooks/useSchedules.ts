import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/app/config/queryKeys"
import { getSchedules } from "../api/scheduleApi"

export const useSchedules = (workflowId: string) => {
  return useQuery({
    queryKey: queryKeys.schedules.all(workflowId),
    queryFn: () => getSchedules(workflowId),
    enabled: !!workflowId,
  })
}
