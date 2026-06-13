import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("container mx-auto p-6 space-y-6 max-w-7xl", className)}>
      {children}
    </div>
  )
}
