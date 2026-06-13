import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GitBranch, Info, Tag } from "lucide-react"
import { type WorkflowItem } from "../types/workflow.types"
import { WorkflowStatusBadge } from "./WorkflowStatusBadge"

interface WorkflowCardProps {
  workflow: WorkflowItem
}

export const WorkflowCard = React.memo(({ workflow }: WorkflowCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            {workflow.name}
          </CardTitle>
          <WorkflowStatusBadge status={workflow.status} />
        </div>
        <CardDescription className="pt-1">
          {workflow.description || <span className="italic">No description provided for this workflow.</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Tag className="h-4 w-4" /> Workflow ID
          </span>
          <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {workflow.id}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Info className="h-4 w-4" /> Published Version ID
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {workflow.publishedVersionId ? (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                {workflow.publishedVersionId}
              </span>
            ) : (
              <span className="text-muted-foreground/50 italic">Unpublished</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Created Date
          </span>
          <span className="text-muted-foreground">{formatDate(workflow.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Last Updated
          </span>
          <span className="text-muted-foreground">{formatDate(workflow.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
})

WorkflowCard.displayName = "WorkflowCard"
