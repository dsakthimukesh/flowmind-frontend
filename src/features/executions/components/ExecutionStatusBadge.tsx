import React from "react"
import { LiveExecutionBadge } from "../realtime/components/LiveExecutionBadge"

interface ExecutionStatusBadgeProps {
  status: string
}

export const ExecutionStatusBadge = React.memo(({ status }: ExecutionStatusBadgeProps) => {
  const normStatus = status?.toUpperCase() || "PENDING"
  switch (normStatus) {
    case "RUNNING":
      return (
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            RUNNING
          </span>
          <LiveExecutionBadge />
        </span>
      )
    case "SUCCESS":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          SUCCESS
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

ExecutionStatusBadge.displayName = "ExecutionStatusBadge"
