import { useQuery } from "@tanstack/react-query"
import { getExecutionLogs } from "../api/executionApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useExecutionLogs = (id: string, page: number, pageSize: number) => {
  return useQuery({
    queryKey: queryKeys.executions.logs(id, page, pageSize),
    queryFn: () => getExecutionLogs(id, { page, pageSize }),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  })
}
