import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AuditPaginationProps {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  isLoading?: boolean
}

export const AuditPagination = ({
  page,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: AuditPaginationProps) => {
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-2xl bg-card shadow-sm">
      {/* Dynamic Count Summary */}
      <div className="text-xs text-muted-foreground font-semibold">
        {totalItems > 0 ? (
          <>
            Showing <span className="text-foreground font-bold">{startItem}</span> to{" "}
            <span className="text-foreground font-bold">{endItem}</span> of{" "}
            <span className="text-foreground font-bold">{totalItems}</span> logs
          </>
        ) : (
          "No audit logs to display"
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-end sm:self-auto">
        {/* Page Size Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => onPageSizeChange(Number(val))}
            disabled={isLoading || totalItems === 0}
          >
            <SelectTrigger className="h-8 w-[70px] rounded-lg">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prev / Next selectors */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={isLoading || page <= 1}
            className="h-8 w-8 rounded-lg"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-xs font-semibold select-none px-1 text-muted-foreground">
            Page <span className="text-foreground font-bold">{page}</span> of{" "}
            <span className="text-foreground font-bold">{totalPages || 1}</span>
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={isLoading || page >= totalPages}
            className="h-8 w-8 rounded-lg"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
