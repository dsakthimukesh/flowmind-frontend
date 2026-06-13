import React from "react"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LogLevelBadge } from "./LogLevelBadge"
import { type ExecutionLog } from "../types/execution.types"
import { EmptyState } from "@/components/common/EmptyState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExecutionLogsTableProps {
  logs: ExecutionLog[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  isLoading?: boolean
}

export const ExecutionLogsTable = React.memo(
  ({
    logs,
    page,
    pageSize,
    totalPages,
    totalItems,
    onPageChange,
    onPageSizeChange,
    isLoading = false,
  }: ExecutionLogsTableProps) => {
    const formatTimestamp = (dateStr: string) => {
      try {
        const date = new Date(dateStr)
        const dateStrFormatted = date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
        const timeStrFormatted = date.toLocaleTimeString(undefined, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        const ms = String(date.getMilliseconds()).padStart(3, "0")
        return `${dateStrFormatted} ${timeStrFormatted}.${ms}`
      } catch {
        return dateStr
      }
    }

    const tableHeaders = React.useMemo(
      () => (
        <TableRow className="hover:bg-transparent border-border">
          <TableHead className="w-[180px]">Timestamp</TableHead>
          <TableHead className="w-[120px]">Node ID</TableHead>
          <TableHead className="w-[100px]">Level</TableHead>
          <TableHead>Message</TableHead>
        </TableRow>
      ),
      []
    )

    return (
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">Execution Logs</CardTitle>
          <div className="text-xs text-muted-foreground font-medium">
            Total logs: <span className="font-semibold text-foreground">{totalItems}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-8 border-t border-border">
              <EmptyState
                title="No logs available"
                description="This execution run has not generated any logs yet."
                icon={<FileText className="h-10 w-10 text-muted-foreground/50" />}
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border-t border-border">
                <Table className="font-mono text-xs">
                  <TableHeader>{tableHeaders}</TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow
                        key={log.id}
                        className="hover:bg-muted/10 transition-colors border-border align-top"
                      >
                        <TableCell className="py-2.5 font-medium text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell className="py-2.5 font-semibold text-foreground/80 truncate max-w-[120px]">
                          {log.nodeId || <span className="text-muted-foreground/30 italic">-</span>}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <LogLevelBadge level={log.level} />
                        </TableCell>
                        <TableCell className="py-2.5 text-foreground leading-relaxed whitespace-pre-wrap select-text selection:bg-primary/20">
                          {log.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination controls */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    Logs per page:
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(val) => onPageSizeChange(Number(val))}
                    disabled={isLoading}
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

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="text-xs text-muted-foreground font-medium">
                    Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                    <span className="font-semibold text-foreground">{totalPages || 1}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => onPageChange(page - 1)}
                      disabled={page <= 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => onPageChange(page + 1)}
                      disabled={page >= totalPages || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }
)

ExecutionLogsTable.displayName = "ExecutionLogsTable"
