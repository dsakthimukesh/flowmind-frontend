import React from "react"
import { Link } from "react-router"
import { ChevronLeft, GitBranch, ShieldCheck } from "lucide-react"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

interface BuilderHeaderProps {
  workflowId: string
  workflowName?: string
  versionNumber?: number
  isPublished?: boolean
}

export const BuilderHeader = React.memo(({
  workflowId,
  workflowName = "Loading Workflow...",
  versionNumber,
  isPublished = false,
}: BuilderHeaderProps) => {
  const isDirty = useWorkflowBuilderStore((state) => state.isDirty)

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 select-none">
      <div className="flex items-center gap-4">
        <Link
          to={`/workflows/${workflowId}`}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Back to Details"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold text-foreground leading-none">{workflowName}</h1>
            {versionNumber !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                v{versionNumber}
              </span>
            )}
            {isDirty && (
              <span 
                id="header-unsaved-badge"
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse select-none shrink-0"
              >
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Visual editor canvas. Arrange logic nodes to direct automated actions.
          </p>
        </div>
      </div>

      <div>
        {isPublished && (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> Published Release (Read-Only)
          </span>
        )}
      </div>
    </header>
  )
})

BuilderHeader.displayName = "BuilderHeader"
