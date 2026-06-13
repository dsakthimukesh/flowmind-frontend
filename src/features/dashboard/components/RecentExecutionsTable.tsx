import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Play, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { type ExecutionItem } from "../types/dashboard.types"
import { EmptyState } from "@/components/common/EmptyState"

interface RecentExecutionsTableProps {
  executions: ExecutionItem[]
}

export const RecentExecutionsTable = React.memo(({ executions }: RecentExecutionsTableProps) => {
  const latestTen = executions.slice(0, 10)

  const renderStatus = (status: ExecutionItem["status"]) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" /> Success
          </span>
        )
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-2.5 py-0.5 rounded-full text-xs font-medium">
            <AlertTriangle className="h-3 w-3" /> Failed
          </span>
        )
      case "running":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-medium animate-pulse">
            <Play className="h-3 w-3" /> Running
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3" /> Queued
          </span>
        )
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Executions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestTen.length === 0 ? (
          <EmptyState
            title="No executions found"
            description="Your workflow runs history will appear here once executed."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Completed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestTen.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-3 font-medium">{renderStatus(item.status)}</TableCell>
                    <TableCell className="py-3 font-medium text-foreground">{item.workflowName}</TableCell>
                    <TableCell className="py-3 text-muted-foreground">{formatDate(item.startedAt)}</TableCell>
                    <TableCell className="py-3 text-muted-foreground">{formatDate(item.completedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

RecentExecutionsTable.displayName = "RecentExecutionsTable"
