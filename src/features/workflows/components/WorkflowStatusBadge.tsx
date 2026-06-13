import React from "react"
import { type WorkflowStatus } from "../types/workflow.types"

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
}

export const WorkflowStatusBadge = React.memo(({ status }: WorkflowStatusBadgeProps) => {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE
        </span>
      )
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          ARCHIVED
        </span>
      )
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          DRAFT
        </span>
      )
  }
})

WorkflowStatusBadge.displayName = "WorkflowStatusBadge"
