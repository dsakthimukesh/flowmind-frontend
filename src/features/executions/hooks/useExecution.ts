import { useQuery } from "@tanstack/react-query"
import { getExecution } from "../api/executionApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useExecution = (id: string) => {
  return useQuery({
    queryKey: queryKeys.executions.detail(id),
    queryFn: () => getExecution(id),
    enabled: !!id,
  })
}
