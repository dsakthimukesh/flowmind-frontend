import { useSearchParams } from "react-router"
import { ChevronLeft, ChevronRight, FilterX } from "lucide-react"
import { PageContainer } from "@/components/common/PageContainer"
import { ExecutionHeader } from "../components/ExecutionHeader"
import { MetricsCards } from "../components/MetricsCards"
import { ExecutionTable } from "../components/ExecutionTable"
import {
  ExecutionTableSkeleton,
  ExecutionMetricsSkeleton,
} from "../components/ExecutionSkeleton"
import { useExecutions } from "../hooks/useExecutions"
import { useExecutionMetrics } from "../hooks/useExecutionMetrics"
import { useWorkflows } from "@/features/workflows/hooks/useWorkflows"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useExecutionRealtime } from "../realtime/hooks/useExecutionRealtime"
import { useRealtimeMetrics } from "../realtime/hooks/useRealtimeMetrics"
import { RealtimeIndicator } from "../realtime/components/RealtimeIndicator"

export const ExecutionsPage = () => {
  useExecutionRealtime()
  useRealtimeMetrics()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "10")
  const workflowId = searchParams.get("workflowId") || undefined

  // Fetch metrics and executions
  const {
    data: executionsResponse,
    isLoading: isLoadingExecutions,
    error: executionsError,
    refetch: refetchExecutions,
    isRefetching: isRefetchingExecutions,
  } = useExecutions(page, pageSize, workflowId)

  const {
    data: metricsResponse,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics,
    isRefetching: isRefetchingMetrics,
  } = useExecutionMetrics()

  // Fetch workflows for dropdown selection filter
  const { data: workflowsResponse } = useWorkflows()
  const workflows = workflowsResponse?.data || []

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchExecutions(), refetchMetrics()])
      toast.success("Workflow executions refreshed successfully")
    } catch {
      toast.error("Failed to refresh executions")
    }
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage))
      return prev
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      prev.set("pageSize", String(newPageSize))
      prev.set("page", "1") // reset to first page
      return prev
    })
  }

  const handleWorkflowChange = (val: string) => {
    setSearchParams((prev) => {
      if (val === "ALL") {
        prev.delete("workflowId")
      } else {
        prev.set("workflowId", val)
      }
      prev.set("page", "1") // reset to first page
      return prev
    })
  }

  const handleClearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("workflowId")
      prev.set("page", "1")
      return prev
    })
  }

  const executions = executionsResponse?.data || []
  const meta = executionsResponse?.meta
  const totalPages = meta?.totalPages || 1
  const totalItems = meta?.totalItems || 0

  const hasError = !!executionsError || !!metricsError
  const isRefreshing = isRefetchingExecutions || isRefetchingMetrics

  return (
    <PageContainer>
      <div className="space-y-6">
        <ExecutionHeader
          title="Workflow Executions"
          subtitle="View details and logs of your active and past workflow runs."
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          actions={<RealtimeIndicator />}
        />

        {hasError ? (
          <ErrorState
            title="Failed to load executions data"
            message={
              executionsError?.message ||
              metricsError?.message ||
              "Something went wrong while loading executions or metrics."
            }
            onRetry={handleRefresh}
          />
        ) : (
          <>
            {/* Metrics cards section */}
            {isLoadingMetrics ? (
              <ExecutionMetricsSkeleton />
            ) : (
              metricsResponse?.data && <MetricsCards metrics={metricsResponse.data} />
            )}

            {/* Filter controls */}
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-[280px]">
                  <label className="text-xs font-semibold text-muted-foreground">Filter by Workflow</label>
                  <Select value={workflowId || "ALL"} onValueChange={handleWorkflowChange}>
                    <SelectTrigger className="h-9 w-full rounded-lg">
                      <SelectValue placeholder="All Workflows" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Workflows</SelectItem>
                      {workflows.map((wf) => (
                        <SelectItem key={wf.id} value={wf.id}>
                          {wf.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {workflowId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="self-end sm:self-auto h-9 gap-1 text-muted-foreground hover:text-foreground mt-4 sm:mt-0"
                  >
                    <FilterX className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Execution table grid */}
            {isLoadingExecutions ? (
              <ExecutionTableSkeleton />
            ) : (
              <div className="space-y-4">
                <ExecutionTable executions={executions} />

                {/* Table page navigations */}
                {executions.length > 0 && (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-xl bg-card">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">Rows per page:</span>
                      <Select
                        value={String(pageSize)}
                        onValueChange={(val) => handlePageSizeChange(Number(val))}
                        disabled={isLoadingExecutions}
                      >
                        <SelectTrigger className="h-8 w-[70px] rounded-lg">
                          <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground ml-4">
                        Showing <span className="font-semibold text-foreground">{executions.length}</span> of{" "}
                        <span className="font-semibold text-foreground">{totalItems}</span> runs
                      </span>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <span className="text-xs text-muted-foreground font-medium">
                        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                        <span className="font-semibold text-foreground">{totalPages}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page <= 1 || isLoadingExecutions}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= totalPages || isLoadingExecutions}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  )
}
