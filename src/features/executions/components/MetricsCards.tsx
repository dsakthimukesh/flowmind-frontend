import React from "react"
import { Activity, Play, CheckCircle2, AlertTriangle, Percent } from "lucide-react"
import { MetricCard } from "@/features/dashboard/components/MetricCard"
import { type ExecutionMetrics } from "../types/execution.types"

interface MetricsCardsProps {
  metrics?: ExecutionMetrics
}

export const MetricsCards = React.memo(({ metrics }: MetricsCardsProps) => {
  const total = metrics?.total ?? 0
  const running = metrics?.running ?? 0
  const success = metrics?.success ?? 0
  const failed = metrics?.failed ?? 0
  
  const formatRate = (rate?: number) => {
    if (rate === undefined || rate === null) return "0.0%"
    if (rate <= 1 && rate > 0) {
      return `${(rate * 100).toFixed(1)}%`
    }
    return `${rate.toFixed(1)}%`
  }

  const successRateText = formatRate(metrics?.successRate)

  const items = [
    {
      title: "Total Executions",
      value: total,
      description: "Lifetime execution count",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Running",
      value: running,
      description: "Active executions",
      icon: <Play className="h-4 w-4 text-blue-500 animate-pulse" />,
    },
    {
      title: "Success",
      value: success,
      description: "Completed without errors",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    {
      title: "Failed",
      value: failed,
      description: "Encountered errors",
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
    },
    {
      title: "Success Rate",
      value: successRateText,
      description: "Successful run ratio",
      icon: <Percent className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-in fade-in slide-in-from-top-4 duration-300">
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
