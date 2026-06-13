import React from "react"
import { Activity, Play, CheckCircle2, AlertTriangle, Percent, Clock } from "lucide-react"
import { MetricCard } from "./MetricCard"
import { type ExecutionMetrics } from "../types/dashboard.types"

interface MetricsCardsProps {
  metrics: ExecutionMetrics
}

export const MetricsCards = React.memo(({ metrics }: MetricsCardsProps) => {
  const successRateText = `${(metrics.successRate * 100).toFixed(1)}%`
  const avgDurationText = `${(metrics.avgDuration / 1000).toFixed(2)}s`

  const items = [
    {
      title: "Total Executions",
      value: metrics.totalExecutions,
      description: "Lifetime execution count",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Running",
      value: metrics.running,
      description: "Active executions in progress",
      icon: <Play className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Success",
      value: metrics.success,
      description: "Completed without errors",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Failed",
      value: metrics.failed,
      description: "Encountered exceptions",
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
    },
    {
      title: "Success Rate",
      value: successRateText,
      description: "Successful executions ratio",
      icon: <Percent className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Avg Duration",
      value: avgDurationText,
      description: "Average workflow run time",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item, index) => (
        <MetricCard
          key={index}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  )
})

MetricsCards.displayName = "MetricsCards"
