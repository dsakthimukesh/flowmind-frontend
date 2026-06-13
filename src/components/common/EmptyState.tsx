import { type ReactNode } from "react"
import { FolderOpen } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export const EmptyState = ({
  title,
  description,
  icon = <FolderOpen className="h-10 w-10 text-muted-foreground" />,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-xl space-y-4 max-w-lg mx-auto my-8">
      <div className="p-4 bg-muted rounded-full">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
