import { useQuery } from "@tanstack/react-query"
import { getAuditLogs } from "../api/auditLogsApi"
import { type AuditLogFilters } from "../types/auditLog.types"
import { queryKeys } from "@/app/config/queryKeys"

export const useAuditLogs = (filters: AuditLogFilters) => {
  return useQuery({
    queryKey: queryKeys.auditLogs.all(filters),
    queryFn: () => getAuditLogs(filters),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new pages/filters
  })
}
