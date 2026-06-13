import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Play, FileText, BarChart } from "lucide-react"
import { type WorkflowSummary } from "../types/dashboard.types"

interface WorkflowSummaryCardProps {
  summary: WorkflowSummary
}

export const WorkflowSummaryCard = React.memo(({ summary }: WorkflowSummaryCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Workflows Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <BarChart className="h-4 w-4 text-muted-foreground" /> Total Templates
          </span>
          <span className="text-sm font-semibold">{summary.total}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Play className="h-4 w-4 text-green-500" /> Active
          </span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {summary.active} active
          </span>
        </div>
        <div className="flex items-center justify-between pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-orange-500" /> Drafts
          </span>
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            {summary.draft} drafts
          </span>
        </div>
      </CardContent>
    </Card>
  )
})

WorkflowSummaryCard.displayName = "WorkflowSummaryCard"
