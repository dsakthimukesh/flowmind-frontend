import React, { useRef, useState, useEffect } from "react"
import { ArrowDown, ChevronLeft, ChevronRight, FileText, Terminal } from "lucide-react"
import { type ExecutionLog } from "../../types/execution.types"
import { LogLevelBadge } from "@/features/executions/components/LogLevelBadge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/common/EmptyState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LiveLogsPanelProps {
  logs: ExecutionLog[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  isLoading?: boolean
}

export const LiveLogsPanel = React.memo(
  ({
    logs,
    page,
    pageSize,
    totalPages,
    totalItems,
    onPageChange,
    onPageSizeChange,
    isLoading = false,
  }: LiveLogsPanelProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [autoScroll, setAutoScroll] = useState(true)
    const [hasUnreadLogs, setHasUnreadLogs] = useState(false)
    const logsCount = logs.length

    // Auto-scroll when new logs arrive, but only if user hasn't scrolled up
    useEffect(() => {
      if (scrollRef.current && autoScroll) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        setHasUnreadLogs(false)
      } else if (logsCount > 0 && !autoScroll) {
        setHasUnreadLogs(true)
      }
    }, [logsCount, autoScroll])

    const handleScroll = () => {
      if (!scrollRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      // If user is within 40px of bottom, keep autoScroll true
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 40
      setAutoScroll(isNearBottom)
      if (isNearBottom) {
        setHasUnreadLogs(false)
      }
    }

    const handleScrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        setAutoScroll(true)
        setHasUnreadLogs(false)
      }
    }

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

    return (
      <Card className="shadow-sm border-border bg-card relative">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Execution Console Logs
          </CardTitle>
          <div className="text-xs text-muted-foreground font-medium">
            Total logs: <span className="font-semibold text-foreground">{totalItems}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[500px]">
          {logs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 border-t border-border">
              <EmptyState
                title="No logs available"
                description="This execution run has not generated any logs yet."
                icon={<FileText className="h-10 w-10 text-muted-foreground/50" />}
              />
            </div>
          ) : (
            <>
              {/* Sticky header and scrollable content viewport */}
              <div className="flex-1 flex flex-col overflow-hidden border-t border-border">
                {/* Table Header (Fixed) */}
                <div className="overflow-x-auto bg-muted/30 shrink-0 border-b border-border">
                  <Table className="font-mono text-xs w-full table-fixed">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead className="w-[120px]">Node ID</TableHead>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>

                {/* Table Body (Scrollable) */}
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto overflow-x-auto min-h-0 relative bg-black/5 dark:bg-black/20"
                >
                  <Table className="font-mono text-xs w-full table-fixed">
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow
                          key={log.id}
                          className="hover:bg-muted/10 transition-colors border-border align-top"
                        >
                          <TableCell className="py-2.5 w-[180px] font-medium text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(log.createdAt || log.timestamp || "")}
                          </TableCell>
                          <TableCell className="py-2.5 w-[120px] font-semibold text-foreground/80 truncate">
                            {log.nodeId || <span className="text-muted-foreground/30 italic">-</span>}
                          </TableCell>
                          <TableCell className="py-2.5 w-[100px]">
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
              </div>

              {/* Floating scroll to bottom anchor */}
              {!autoScroll && hasUnreadLogs && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleScrollToBottom}
                  className="absolute bottom-16 right-6 gap-1.5 shadow-lg rounded-full animate-bounce z-20"
                >
                  <ArrowDown className="h-3.5 w-3.5 animate-pulse" />
                  New logs below
                </Button>
              )}

              {/* Sticky pagination footer */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-border bg-muted/20 shrink-0">
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

LiveLogsPanel.displayName = "LiveLogsPanel"
