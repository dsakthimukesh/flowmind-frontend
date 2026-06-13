import { Skeleton } from "@/components/ui/skeleton"

export const AuditLogsSkeleton = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Table Header skeleton */}
      <div className="h-12 border-b border-border bg-muted/40 px-6 flex items-center gap-4">
        <Skeleton className="h-4 w-[140px]" />
        <Skeleton className="h-4 w-[180px]" />
        <Skeleton className="h-4 w-[110px]" />
        <Skeleton className="h-4 w-[110px]" />
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[60px] ml-auto" />
      </div>
      {/* Table Rows skeletons */}
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-5 flex items-center gap-4">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-5 w-[110px] rounded-full" />
            <Skeleton className="h-5 w-[110px] rounded-full" />
            <Skeleton className="h-4 w-[160px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-8 w-[60px] rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
