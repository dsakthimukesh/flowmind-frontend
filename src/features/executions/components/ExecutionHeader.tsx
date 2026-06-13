import React from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExecutionHeaderProps {
  title: string
  subtitle?: string
  backUrl?: string
  onRefresh?: () => void
  isRefreshing?: boolean
  actions?: React.ReactNode
}

export const ExecutionHeader = React.memo(
  ({ title, subtitle, backUrl, onRefresh, isRefreshing, actions }: ExecutionHeaderProps) => {
    const navigate = useNavigate()

    return (
      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          {backUrl && (
            <Button
              variant="outline"
              size="icon"
              className="mt-1 h-8 w-8 shrink-0 rounded-lg"
              onClick={() => navigate(backUrl)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-9 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
          {actions}
        </div>
      </div>
    )
  }
)

ExecutionHeader.displayName = "ExecutionHeader"
