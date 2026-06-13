import { useState } from "react"
import { Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"

import { AuditFilters } from "../components/AuditFilters"
import { AuditLogsTable } from "../components/AuditLogsTable"
import { AuditPagination } from "../components/AuditPagination"
import { AuditDetailDrawer } from "../components/AuditDetailDrawer"
import { AuditLogsSkeleton } from "../components/AuditLogsSkeleton"

import { useAuditLogs } from "../hooks/useAuditLogs"
import { useAuditLogFilters } from "../hooks/useAuditLogFilters"
import { type AuditLogItem } from "../types/auditLog.types"

export const AuditLogsPage = () => {
  const { filters, setFilter, clearFilters } = useAuditLogFilters()

  // Details drawer local state
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Query logs with current filter state
  const { data: logsResponse, isLoading, error, refetch, isRefetching } = useAuditLogs(filters)

  const logs = logsResponse?.data || []
  const meta = logsResponse?.meta
  const totalPages = meta?.totalPages || 1
  const totalItems = meta?.totalItems || 0

  const handleRefresh = async () => {
    try {
      await refetch()
      toast.success("Audit logs reloaded successfully")
    } catch {
      toast.error("Failed to reload audit logs")
    }
  }

  const handleViewDetail = (log: AuditLogItem) => {
    setSelectedLog(log)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    // Delay clearing selected log to allow drawer slide-out animation to finish
    setTimeout(() => setSelectedLog(null), 200)
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Audit Logs"
          description="Monitor administrative changes, login attempts, user activities, and security events across your organization."
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-9 gap-1.5"
                title="Refresh logs"
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("CSV Export functionality has been prepared and will be active in the next release.")
                }
                className="h-9 gap-1.5"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("JSON Export functionality has been prepared and will be active in the next release.")
                }
                className="h-9 gap-1.5"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </div>
          }
        />

        {/* Search & Selection Filter Panels */}
        <AuditFilters
          filters={filters}
          onChange={setFilter}
          onClear={clearFilters}
        />

        {/* Main Content Area */}
        {error ? (
          <ErrorState
            title="Failed to load audit logs"
            message={error.message || "An unexpected error occurred while fetching audit log history."}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <AuditLogsSkeleton />
        ) : (
          <div className="space-y-4">
            <AuditLogsTable logs={logs} onViewDetail={handleViewDetail} />

            {/* Pagination Controls */}
            {logs.length > 0 && (
              <AuditPagination
                page={filters.page}
                pageSize={filters.pageSize}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={(page) => setFilter("page", page)}
                onPageSizeChange={(pageSize) => setFilter("pageSize", pageSize)}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>

      {/* Details Side-Drawer */}
      <AuditDetailDrawer
        log={selectedLog}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </PageContainer>
  )
}
