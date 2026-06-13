import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const ScheduleSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Table Header skeleton */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Row skeletons */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
