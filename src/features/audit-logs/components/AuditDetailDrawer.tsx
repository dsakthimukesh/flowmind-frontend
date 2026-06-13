import { useState } from "react"
import { Copy, Check, Terminal, Clock, User, ShieldAlert } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AuditActionBadge } from "./AuditActionBadge"
import { AuditResourceBadge } from "./AuditResourceBadge"
import { type AuditLogItem } from "../types/auditLog.types"

interface AuditDetailDrawerProps {
  log: AuditLogItem | null
  open: boolean
  onClose: () => void
}

export const AuditDetailDrawer = ({ log, open, onClose }: AuditDetailDrawerProps) => {
  const [copied, setCopied] = useState(false)

  if (!log) return null

  const handleCopyMetadata = () => {
    navigator.clipboard.writeText(JSON.stringify(log.metadata, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const actorName =
    log.actor.firstName || log.actor.lastName
      ? `${log.actor.firstName || ""} ${log.actor.lastName || ""}`.trim()
      : "System Trigger"

  const formattedDate = new Date(log.timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  })

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-md w-full border-l border-border bg-card flex flex-col h-full overflow-hidden p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/20 pb-4 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Event Details
            </span>
          </div>
          <SheetTitle className="text-lg font-bold truncate">
            {log.action.replace(/_/g, " ")}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground font-medium truncate">
            Log ID: {log.id}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Event Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Attributes List */}
          <div className="space-y-4">
            {/* Timestamp */}
            <div className="flex items-start gap-3">
              <Clock className="h-4.5 w-4.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </span>
                <span className="text-sm font-medium text-foreground">{formattedDate}</span>
              </div>
            </div>

            {/* Actor Details */}
            <div className="flex items-start gap-3">
              <User className="h-4.5 w-4.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Actor Profile
                </span>
                <span className="text-sm font-bold text-foreground block">{actorName}</span>
                <span className="text-xs text-muted-foreground block font-semibold">
                  {log.actor.email}
                </span>
                <span className="text-[10px] text-muted-foreground/85 font-mono block select-all">
                  User ID: {log.actor.id}
                </span>
              </div>
            </div>

            {/* Badges and Resources Info */}
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-4.5 w-4.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-2">
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Security context
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <AuditActionBadge action={log.action} />
                    <AuditResourceBadge resourceType={log.resourceType} />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Resource ID
                  </span>
                  <span className="text-xs font-mono text-foreground font-semibold bg-muted px-1.5 py-0.5 rounded border border-border select-all break-all">
                    {log.resourceId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Metadata pre JSON section */}
          <div className="space-y-2 flex flex-col h-[calc(100%-250px)] min-h-[200px]">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Event Metadata
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={handleCopyMetadata}
                className="h-7 px-2 text-xs gap-1 border-border/80"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy JSON
                  </>
                )}
              </Button>
            </div>
            <div className="flex-1 rounded-xl bg-slate-950 dark:bg-slate-900 border border-border overflow-hidden p-4 font-mono text-xs text-slate-100 flex flex-col">
              <pre className="flex-1 overflow-auto whitespace-pre select-text pr-2 custom-scrollbar">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
