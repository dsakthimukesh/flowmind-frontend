import { Skeleton } from "@/components/ui/skeleton"

export const ApiKeyTableSkeleton = () => {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="h-10 border-b border-border bg-muted/40 px-4 flex items-center gap-4">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[85px] ml-auto" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-8 w-[85px] rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
