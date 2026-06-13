import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { type ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  className?: string
}

export const MetricCard = React.memo(({ title, value, description, icon, className }: MetricCardProps) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
          {icon && <div className="text-muted-foreground shrink-0">{icon}</div>}
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

MetricCard.displayName = "MetricCard"
