import React, { type ReactNode } from "react"
import { Handle, Position } from "reactflow"
import { cn } from "@/lib/utils"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export interface BaseNodeProps {
  title: string
  description?: string
  icon: ReactNode
  selected?: boolean
  borderColorClass?: string
  iconColorClass?: string
  inputs?: boolean // Renders Target handle on Left
  outputs?: boolean // Renders Source handle on Right
  customHandles?: ReactNode // Render custom handles (like multiple condition exits)
  isConfigured?: boolean
  showBadge?: boolean
  isInvalid?: boolean
}

export const BaseNode = React.memo(({
  title,
  description,
  icon,
  selected,
  borderColorClass = "border-border",
  iconColorClass = "text-primary",
  inputs = true,
  outputs = true,
  customHandles,
  isConfigured = false,
  showBadge = true,
  isInvalid = false,
}: BaseNodeProps) => {
  const searchQuery = useWorkflowBuilderStore((state) => state.searchQuery)

  const isHighlighted = React.useMemo(() => {
    if (!searchQuery) return false
    const q = searchQuery.toLowerCase().trim()
    return (
      title.toLowerCase().includes(q) ||
      (description && description.toLowerCase().includes(q))
    )
  }, [searchQuery, title, description])

  return (
    <div
      className={cn(
        "px-4 py-3 min-w-[200px] max-w-[260px] rounded-xl border shadow-md backdrop-blur-sm transition-all duration-200 select-none",
        isHighlighted
          ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 shadow-amber-500/20 shadow-md animate-pulse"
          : isInvalid
            ? "border-destructive/60 bg-destructive/5 dark:bg-destructive/5"
            : cn("bg-card/90", borderColorClass),
        selected
          ? isHighlighted
            ? "ring-2 ring-amber-500 border-amber-500 scale-[1.02]"
            : isInvalid
              ? "ring-2 ring-destructive border-destructive scale-[1.02]"
              : "ring-2 ring-primary border-primary scale-[1.02]"
          : isHighlighted
            ? "hover:border-amber-500"
            : isInvalid
              ? "hover:border-destructive"
              : "hover:border-primary/50"
      )}
    >
      {/* Target handle (left side) */}
      {inputs && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 border-2 border-background bg-primary-foreground rounded-full !bg-border"
        />
      )}

      {/* Main card info */}
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-muted flex items-center justify-center", iconColorClass)}>
          {icon}
        </div>
        <div className="space-y-0.5 overflow-hidden flex-1">
          <h3 className="text-sm font-bold text-foreground truncate">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
              {description}
            </p>
          )}
          {showBadge && (
            <div className="pt-2">
              {isConfigured ? (
                <span className="inline-flex items-center text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                  Needs Setup
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Source handle (right side) */}
      {outputs && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 border-2 border-background bg-primary-foreground rounded-full !bg-primary"
        />
      )}

      {/* Optional custom handles override */}
      {customHandles}
    </div>
  )
})

BaseNode.displayName = "BaseNode"
