import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import { type AuditLogItem, type AuditLogFilters } from "../types/auditLog.types"

export const getAuditLogs = async (
  params?: AuditLogFilters
): Promise<ApiResponse<AuditLogItem[]>> => {
  const response = await apiClient.get<ApiResponse<AuditLogItem[]>>("/v1/audit-logs", {
    params: {
      page: params?.page,
      limit: params?.pageSize,
      pageSize: params?.pageSize,
      action: params?.action || undefined,
      actorId: params?.actorId || undefined,
      resourceType: params?.resourceType || undefined,
      dateFrom: params?.dateFrom || undefined,
      dateTo: params?.dateTo || undefined,
    },
  })
  return response.data
}
