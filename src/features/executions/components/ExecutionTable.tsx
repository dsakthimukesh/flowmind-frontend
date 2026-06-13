import React from "react"
import { useNavigate, useLocation } from "react-router"
import { ArrowRight, Play } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type WorkflowExecution } from "../types/execution.types"
import { ExecutionStatusBadge } from "./ExecutionStatusBadge"
import { EmptyState } from "@/components/common/EmptyState"

interface ExecutionTableProps {
  executions: WorkflowExecution[]
}

export const ExecutionTable = React.memo(({ executions }: ExecutionTableProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleString(undefined, {
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

  const handleRowClick = (id: string) => {
    // Preserve current query parameters in navigation state
    navigate(`/executions/${id}`, {
      state: { fromSearch: location.search },
    })
  }

  const tableHeaders = React.useMemo(
    () => (
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[180px]">Execution ID</TableHead>
        <TableHead>Workflow</TableHead>
        <TableHead className="w-[120px]">Status</TableHead>
        <TableHead className="w-[180px]">Started</TableHead>
        <TableHead className="w-[180px]">Completed</TableHead>
        <TableHead className="w-[100px]">Duration</TableHead>
        <TableHead className="w-[80px] text-right">View</TableHead>
      </TableRow>
    ),
    []
  )

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-0">
        {executions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No executions found"
              description="No workflow execution runs matched your search filters."
              icon={<Play className="h-10 w-10 text-muted-foreground/50" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {executions.map((execution) => (
                  <TableRow
                    key={execution.id}
                    onClick={() => handleRowClick(execution.id)}
                    className="cursor-pointer hover:bg-muted/30 transition-colors group"
                  >
                    <TableCell className="py-3.5 font-mono text-xs text-muted-foreground select-all font-medium truncate max-w-[150px]">
                      {execution.id}
                    </TableCell>
                    <TableCell className="py-3.5 font-semibold text-foreground group-hover:text-primary transition-colors">
                      {execution.workflowName}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <ExecutionStatusBadge status={execution.status} />
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs font-medium">
                      {formatDateTime(execution.startedAt)}
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs font-medium">
                      {formatDateTime(execution.completedAt)}
                    </TableCell>
                    <TableCell className="py-3.5 text-foreground text-xs font-semibold">
                      {formatDuration(execution.duration)}
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      <Button
                        id={`execution-view-detail-${execution.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(execution.id)
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
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

ExecutionTable.displayName = "ExecutionTable"
