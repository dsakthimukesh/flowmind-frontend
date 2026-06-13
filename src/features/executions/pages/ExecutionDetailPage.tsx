import React from "react"
import { useParams, useLocation } from "react-router"
import { Play, Calendar, Clock, AlertCircle } from "lucide-react"
import { PageContainer } from "@/components/common/PageContainer"
import { ExecutionHeader } from "../components/ExecutionHeader"
import { ExecutionTimeline } from "../components/ExecutionTimeline"
import { LiveLogsPanel } from "../realtime/components/LiveLogsPanel"
import { ExecutionStatusBadge } from "../components/ExecutionStatusBadge"
import { useExecutionRealtime } from "../realtime/hooks/useExecutionRealtime"
import { useExecutionLogsRealtime } from "../realtime/hooks/useExecutionLogsRealtime"
import { ExecutionDetailSkeleton } from "../components/ExecutionSkeleton"
import { useExecution } from "../hooks/useExecution"
import { useExecutionLogs } from "../hooks/useExecutionLogs"
import { ErrorState } from "@/components/common/ErrorState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export const ExecutionDetailPage = () => {
  const { executionId } = useParams<{ executionId: string }>()
  const location = useLocation()

  // Realtime updates integration
  useExecutionRealtime(executionId)
  useExecutionLogsRealtime(executionId || "")

  // Logs table local state
  const [logsPage, setLogsPage] = React.useState(1)
  const [logsPageSize, setLogsPageSize] = React.useState(25)

  // Fetch execution and logs
  const {
    data: executionResponse,
    isLoading: isLoadingExecution,
    error: executionError,
    refetch: refetchExecution,
    isRefetching: isRefetchingExecution,
  } = useExecution(executionId || "")

  const {
    data: logsResponse,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
    isRefetching: isRefetchingLogs,
  } = useExecutionLogs(executionId || "", logsPage, logsPageSize)

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchExecution(), refetchLogs()])
      toast.success("Execution details and logs refreshed")
    } catch {
      toast.error("Failed to refresh execution data")
    }
  }

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDuration = (ms: number | null | undefined) => {
    if (ms === null || ms === undefined) return "-"
    if (ms < 1000) return `${ms}ms`
    const seconds = (ms / 1000).toFixed(1)
    if (parseFloat(seconds) < 60) return `${seconds}s`
    const minutes = Math.floor(ms / 60000)
    const remainingSeconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}m ${remainingSeconds}s`
  }

  // Back URL redirects to executions list preserving pagination/filter state via query params
  const backUrl = (location.state as any)?.fromSearch
    ? `/executions${(location.state as any).fromSearch}`
    : "/executions"

  const isLoading = isLoadingExecution || isLoadingLogs
  const isRefreshing = isRefetchingExecution || isRefetchingLogs

  if (executionError) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <ExecutionHeader title="Execution Details" backUrl={backUrl} />
          <ErrorState
            title="Failed to load execution details"
            message={executionError.message || "An unexpected error occurred while fetching the execution details."}
            onRetry={handleRefresh}
          />
        </div>
      </PageContainer>
    )
  }

  const execution = executionResponse?.data
  const logs = logsResponse?.data || []
  const logsMeta = logsResponse?.meta

  return (
    <PageContainer>
      <div className="space-y-6">
        <ExecutionHeader
          title={execution ? `Execution Details` : "Loading..."}
          subtitle={execution ? `ID: ${execution.id}` : undefined}
          backUrl={backUrl}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          actions={
            execution && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground mr-1">Status:</span>
                <ExecutionStatusBadge status={execution.status} />
              </div>
            )
          }
        />

        {isLoading && !execution ? (
          <ExecutionDetailSkeleton />
        ) : (
          execution && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Metadata and timeline */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  {/* Metadata Card */}
                  <Card className="shadow-sm border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Play className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Workflow</div>
                          <div className="text-sm font-bold text-foreground">
                            {execution.workflowName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Duration</div>
                          <div className="text-sm font-bold text-foreground font-mono">
                            {formatDuration(execution.duration)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Started At</div>
                          <div className="text-sm font-semibold text-foreground/80 font-mono">
                            {formatDateTime(execution.startedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Completed At</div>
                          <div className="text-sm font-semibold text-foreground/80 font-mono">
                            {formatDateTime(execution.completedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* If failed, show error message detail */}
                  {execution.status === "FAILED" && execution.errorMessage && (
                    <Card className="border-red-500/20 bg-red-500/5 dark:bg-red-950/10">
                      <CardContent className="p-5 flex items-start gap-3.5">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-red-800 dark:text-red-400">
                            Failure Exception Details
                          </h4>
                          <p className="text-xs font-mono text-red-700 dark:text-red-300 bg-red-500/10 dark:bg-red-950/30 p-3 rounded-lg border border-red-500/10 overflow-x-auto leading-relaxed select-text select-all">
                            {execution.errorMessage}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="md:col-span-1">
                  <ExecutionTimeline execution={execution} />
                </div>
              </div>

              {/* Live Logs console panel */}
              <LiveLogsPanel
                logs={logs}
                page={logsPage}
                pageSize={logsPageSize}
                totalPages={logsMeta?.totalPages || 1}
                totalItems={logsMeta?.totalItems || 0}
                onPageChange={setLogsPage}
                onPageSizeChange={(sz) => {
                  setLogsPageSize(sz)
                  setLogsPage(1)
                }}
                isLoading={isLoadingLogs}
              />
            </div>
          )
        )}
      </div>
    </PageContainer>
  )
}
