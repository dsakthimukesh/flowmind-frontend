import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import { type AuditLogItem, type AuditLogFilters } from "../types/auditLog.types"

export const getAuditLogs = async (
  params?: AuditLogFilters
): Promise<ApiResponse<AuditLogItem[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/audit-logs", {
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
  return {
    ...response.data,
    data: response.data.data.logs,
    meta: {
      page: response.data.data.page,
      limit: response.data.data.pageSize,
      totalItems: response.data.data.total,
      totalPages: Math.ceil(response.data.data.total / (response.data.data.pageSize || 1)),
    },
  }
}
