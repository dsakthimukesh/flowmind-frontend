import React from "react"
import { Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuditActionBadge } from "./AuditActionBadge"
import { AuditResourceBadge } from "./AuditResourceBadge"
import { type AuditLogItem } from "../types/auditLog.types"
import { EmptyState } from "@/components/common/EmptyState"

interface AuditLogsTableProps {
  logs: AuditLogItem[]
  onViewDetail: (log: AuditLogItem) => void
}

export const AuditLogsTable = React.memo(({ logs, onViewDetail }: AuditLogsTableProps) => {
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Get a readable message/description for the audit event
  const getLogDetails = (log: AuditLogItem) => {
    if (log.metadata?.description) return String(log.metadata.description)
    if (log.metadata?.message) return String(log.metadata.message)

    const actorName = log.actor.firstName
      ? `${log.actor.firstName} ${log.actor.lastName || ""}`.trim()
      : log.actor.email

    const actionText = log.action.toLowerCase().replace(/_/g, " ")
    const typeText = log.resourceType.toLowerCase().replace(/_/g, " ")

    return `${actorName} performed ${actionText} on ${typeText}`
  }

  const tableHeaders = React.useMemo(
    () => (
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[160px]">Timestamp</TableHead>
        <TableHead className="w-[220px]">Actor</TableHead>
        <TableHead className="w-[140px]">Action</TableHead>
        <TableHead className="w-[140px]">Resource Type</TableHead>
        <TableHead className="w-[140px]">Resource ID</TableHead>
        <TableHead className="min-w-[200px]">Details</TableHead>
        <TableHead className="w-[70px] text-right">View</TableHead>
      </TableRow>
    ),
    []
  )

  return (
    <Card className="shadow-sm border-border bg-card rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No audit logs found"
              description="No audit logs matched your search filters."
              icon={<Eye className="h-10 w-10 text-muted-foreground/50" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const actorName =
                    log.actor.firstName || log.actor.lastName
                      ? `${log.actor.firstName || ""} ${log.actor.lastName || ""}`.trim()
                      : "System"

                  return (
                    <TableRow
                      key={log.id}
                      onClick={() => onViewDetail(log)}
                      className="cursor-pointer hover:bg-muted/30 transition-colors group"
                    >
                      {/* Timestamp */}
                      <TableCell className="py-3.5 text-muted-foreground text-xs font-semibold whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </TableCell>

                      {/* Actor details */}
                      <TableCell className="py-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground truncate max-w-[180px]">
                            {actorName}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[180px] font-semibold">
                            {log.actor.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Action badge */}
                      <TableCell className="py-3.5">
                        <AuditActionBadge action={log.action} />
                      </TableCell>

                      {/* Resource badge */}
                      <TableCell className="py-3.5">
                        <AuditResourceBadge resourceType={log.resourceType} />
                      </TableCell>

                      {/* Truncated Resource ID */}
                      <TableCell className="py-3.5">
                        <span
                          className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/80 truncate max-w-[120px] inline-block font-semibold select-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {log.resourceId}
                        </span>
                      </TableCell>

                      {/* Log details context summary */}
                      <TableCell className="py-3.5 text-sm text-foreground/80 font-medium max-w-[320px] truncate">
                        {getLogDetails(log)}
                      </TableCell>

                      {/* Action: Open details drawer */}
                      <TableCell className="py-3.5 text-right">
                        <Button
                          id={`audit-log-view-drawer-${log.id}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewDetail(log)
                          }}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          <span className="sr-only">View Event Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

AuditLogsTable.displayName = "AuditLogsTable"
