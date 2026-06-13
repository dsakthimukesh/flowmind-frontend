import React from "react"
import { FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { MetricCard } from "@/features/dashboard/components/MetricCard"
import { type KnowledgeBaseStats as IKbStats } from "../types/knowledgeBase.types"

interface KnowledgeBaseStatsProps {
  stats: IKbStats
}

export const KnowledgeBaseStats = React.memo(({ stats }: KnowledgeBaseStatsProps) => {
  const items = [
    {
      title: "Total Documents",
      value: stats.total,
      description: "Files in knowledge library",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Processed Documents",
      value: stats.processed,
      description: "Successfully indexed chunks",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    {
      title: "Failed Documents",
      value: stats.failed,
      description: "Encountered processing errors",
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
    },
    {
      title: "Pending Documents",
      value: stats.pending,
      description: "Queued for vector processing",
      icon: <Clock className="h-4 w-4 text-amber-500 animate-pulse" />,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-in fade-in duration-300">
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

KnowledgeBaseStats.displayName = "KnowledgeBaseStats"
