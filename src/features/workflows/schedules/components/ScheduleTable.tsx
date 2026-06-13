import React from "react"
import { Trash2, Calendar, Globe, Clock } from "lucide-react"
import { type WorkflowSchedule } from "../types/schedule.types"
import { ScheduleStatusBadge } from "./ScheduleStatusBadge"
import { Button } from "@/components/ui/button"

interface ScheduleTableProps {
  schedules: WorkflowSchedule[]
  workflowId: string
  canModify: boolean
  onDeleteClick: (scheduleId: string) => void
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  canModify,
  onDeleteClick,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border bg-card/40 rounded-2xl gap-3 select-none">
        <div className="p-3 bg-muted rounded-full text-muted-foreground border border-border">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">No schedules configured</h3>
          <p className="text-xs text-muted-foreground max-w-[280px]">
            Create your first schedule to run this workflow on a recurring interval.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground text-xs select-none">
              <th className="p-4">Cron Frequency</th>
              <th className="p-4">Timezone</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 text-center">Status</th>
              {canModify && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-4 font-mono font-bold text-foreground text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <code className="bg-secondary/70 border border-border px-2 py-0.5 rounded text-[11px]">
                      {schedule.cronExpression}
                    </code>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{schedule.timezone}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground text-xs">
                  {formatDate(schedule.createdAt)}
                </td>
                <td className="p-4 text-center">
                  <ScheduleStatusBadge status={schedule.status} />
                </td>
                {canModify && (
                  <td className="p-4 text-right">
                    <Button
                      id={`schedule-delete-trigger-${schedule.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={() => onDeleteClick(schedule.id)}
                      title="Delete Schedule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
