import React from "react"
import { type DocumentStatus } from "../types/knowledgeBase.types"

interface DocumentStatusBadgeProps {
  status: DocumentStatus
}

export const DocumentStatusBadge = React.memo(({ status }: DocumentStatusBadgeProps) => {
  const normStatus = status?.toUpperCase() || "PENDING"
  switch (normStatus) {
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          PROCESSING
        </span>
      )
    case "PROCESSED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          PROCESSED
        </span>
      )
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          FAILED
        </span>
      )
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
          PENDING
        </span>
      )
  }
})

DocumentStatusBadge.displayName = "DocumentStatusBadge"
