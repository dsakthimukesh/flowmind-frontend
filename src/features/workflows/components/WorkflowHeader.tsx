import React, { type ReactNode } from "react"
import { Link } from "react-router"
import { ChevronLeft } from "lucide-react"

interface WorkflowHeaderProps {
  title: string
  description?: string
  backLink?: string
  backText?: string
  actions?: ReactNode
}

export const WorkflowHeader = React.memo(
  ({ title, description, backLink, backText = "Back to list", actions }: WorkflowHeaderProps) => {
    return (
      <div className="flex flex-col gap-4 pb-6 border-b border-border mb-6">
        {backLink && (
          <Link
            to={backLink}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ChevronLeft className="h-4 w-4" /> {backText}
          </Link>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    )
  }
)

WorkflowHeader.displayName = "WorkflowHeader"
