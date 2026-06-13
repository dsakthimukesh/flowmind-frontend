import React from "react"
import { Link } from "react-router"
import { ArrowRight, FileQuestion } from "lucide-react"
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
import { type WorkflowItem } from "../types/workflow.types"
import { WorkflowStatusBadge } from "./WorkflowStatusBadge"
import { EmptyState } from "@/components/common/EmptyState"

interface WorkflowTableProps {
  workflows: WorkflowItem[]
}

export const WorkflowTable = React.memo(({ workflows }: WorkflowTableProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Memoized table header columns definition
  const tableHeaders = React.useMemo(
    () => (
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Created Date</TableHead>
        <TableHead>Updated Date</TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    ),
    []
  )

  return (
    <Card>
      <CardContent className="p-0">
        {workflows.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No workflows found"
              description="Create your first workflow."
              icon={<FileQuestion className="h-10 w-10 text-muted-foreground" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id} className="hover:bg-muted/30">
                    <TableCell className="py-4 font-semibold text-foreground">
                      <Link
                        to={`/workflows/${workflow.id}`}
                        className="hover:underline hover:text-primary transition-colors"
                      >
                        {workflow.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground max-w-[240px] truncate">
                      {workflow.description || <span className="text-xs italic text-muted-foreground/50">No description</span>}
                    </TableCell>
                    <TableCell className="py-4">
                      <WorkflowStatusBadge status={workflow.status} />
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground text-sm">
                      {formatDate(workflow.createdAt)}
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground text-sm">
                      {formatDate(workflow.updatedAt)}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Button
                        id={`workflow-view-detail-${workflow.id}`}
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/workflows/${workflow.id}`}>
                          View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
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

WorkflowTable.displayName = "WorkflowTable"
