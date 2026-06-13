import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const KnowledgeBaseCardSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const KnowledgeBaseTableSkeleton = () => {
  return (
    <div className="rounded-md border border-border">
      <div className="h-10 border-b border-border bg-muted/40 px-4 flex items-center gap-4">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[350px]" />
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[350px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const KnowledgeBaseStatsSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-[80px] pb-2" />
            <Skeleton className="h-8 w-[50px] mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const DocumentTableSkeleton = () => {
  return (
    <div className="rounded-md border border-border">
      <div className="h-10 border-b border-border bg-muted/40 px-4 flex items-center gap-4">
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-5 w-[80px] rounded-full" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
