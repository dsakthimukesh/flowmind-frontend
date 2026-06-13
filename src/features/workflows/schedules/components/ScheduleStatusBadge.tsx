import React from "react"
import { ShieldCheck, ShieldAlert } from "lucide-react"

interface ScheduleStatusBadgeProps {
  status: "ENABLED" | "DISABLED"
}

export const ScheduleStatusBadge: React.FC<ScheduleStatusBadgeProps> = ({ status }) => {
  const isEnabled = status === "ENABLED"

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold select-none ${
        isEnabled
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          : "bg-muted text-muted-foreground border border-border"
      }`}
    >
      {isEnabled ? (
        <>
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Enabled</span>
        </>
      ) : (
        <>
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Disabled</span>
        </>
      )}
    </span>
  )
}
