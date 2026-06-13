import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"
import { ErrorState } from "@/components/common/ErrorState"
import { useOrganizationSummary } from "../hooks/useOrganizationSummary"
import { useDashboardMetrics } from "../hooks/useDashboardMetrics"
import { useRecentExecutions } from "../hooks/useRecentExecutions"
import { useWorkflowSummary } from "../hooks/useWorkflowSummary"

import { MetricsCards } from "../components/MetricsCards"
import { RecentExecutionsTable } from "../components/RecentExecutionsTable"
import { WorkflowSummaryCard } from "../components/WorkflowSummaryCard"
import { OrganizationOverview } from "../components/OrganizationOverview"
import { DashboardSkeleton } from "../components/DashboardSkeleton"

export const DashboardPage = () => {
  const orgQuery = useOrganizationSummary()
  const metricsQuery = useDashboardMetrics()
  const execsQuery = useRecentExecutions()
  const workflowsQuery = useWorkflowSummary()

  const isLoading =
    orgQuery.isLoading ||
    metricsQuery.isLoading ||
    execsQuery.isLoading ||
    workflowsQuery.isLoading

  const isError =
    orgQuery.isError ||
    metricsQuery.isError ||
    execsQuery.isError ||
    workflowsQuery.isError

  const handleRetry = () => {
    orgQuery.refetch()
    metricsQuery.refetch()
    execsQuery.refetch()
    workflowsQuery.refetch()
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" description="Overview of your automation workspace." />
        <ErrorState
          title="Failed to load dashboard data"
          message="There was an error communicating with the backend. Please try again."
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Overview of your automation workspace." />

      {/* Metrics Cards */}
      {metricsQuery.data?.data && (
        <section aria-labelledby="execution-metrics-title">
          <h2 id="execution-metrics-title" className="sr-only">Execution Metrics</h2>
          <MetricsCards metrics={metricsQuery.data.data} />
        </section>
      )}

      {/* Layout Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Organization Overview */}
        {orgQuery.data?.data && (
          <div className="lg:col-span-1">
            <OrganizationOverview organization={orgQuery.data.data} />
          </div>
        )}

        {/* Workflow Summary */}
        {workflowsQuery.data?.summary && (
          <div className="lg:col-span-1">
            <WorkflowSummaryCard summary={workflowsQuery.data.summary} />
          </div>
        )}

        {/* Recent Executions Table */}
        {execsQuery.data?.data && (
          <div className="md:col-span-2 lg:col-span-3">
            <RecentExecutionsTable executions={execsQuery.data.data} />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
