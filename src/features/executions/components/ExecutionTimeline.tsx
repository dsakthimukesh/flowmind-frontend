import React from "react"
import { Check, Clock, Play, AlertCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type WorkflowExecution } from "../types/execution.types"

interface ExecutionTimelineProps {
  execution: WorkflowExecution
}

export const ExecutionTimeline = React.memo(({ execution }: ExecutionTimelineProps) => {
  const { status, startedAt, completedAt, errorMessage } = execution

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Define steps
  // 1. Created (Always done once we have startedAt)
  // 2. Started (Done if status is RUNNING, SUCCESS, or FAILED)
  // 3. Completed or Failed (Done if status is SUCCESS or FAILED)

  const steps = [
    {
      title: "Created",
      description: "Workflow execution initialized and queued.",
      timestamp: formatDateTime(startedAt),
      status: "success",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: status === "PENDING" ? "Starting" : "Started",
      description: "Workflow execution started running nodes.",
      timestamp: status !== "PENDING" ? formatDateTime(startedAt) : undefined,
      status: status === "PENDING" ? "pending" : "success",
      icon: status === "PENDING" ? <Clock className="h-4 w-4" /> : <Play className="h-4 w-4" />,
    },
    {
      title: status === "FAILED" ? "Failed" : "Completed",
      description:
        status === "FAILED"
          ? errorMessage || "Workflow failed due to an error during execution."
          : status === "SUCCESS"
          ? "Workflow execution completed successfully."
          : "Pending workflow completion.",
      timestamp: status === "SUCCESS" || status === "FAILED" ? formatDateTime(completedAt) : undefined,
      status:
        status === "SUCCESS"
          ? "success"
          : status === "FAILED"
          ? "failed"
          : "pending",
      icon:
        status === "SUCCESS" ? (
          <Check className="h-4 w-4" />
        ) : status === "FAILED" ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <HelpCircle className="h-4 w-4" />
        ),
    },
  ]

  return (
    <Card className="shadow-sm border-border bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Execution Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-muted pl-6 space-y-8 ml-3">
          {steps.map((step, index) => {
            const isSuccess = step.status === "success"
            const isFailed = step.status === "failed"
            const isPending = step.status === "pending"

            let circleColor = "bg-muted border-muted text-muted-foreground"
            if (isSuccess) {
              circleColor = "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
            } else if (isFailed) {
              circleColor = "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400"
            } else if (isPending && status === "RUNNING" && index === 2) {
              circleColor = "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 animate-pulse"
            }

            return (
              <div key={index} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[38px] top-0.5 flex items-center justify-center rounded-full border-2 w-7 h-7 bg-card z-10 transition-colors ${circleColor}`}
                >
                  {step.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4
                      className={`text-sm font-semibold transition-colors ${
                        isFailed ? "text-destructive" : isSuccess ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.timestamp && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
})

ExecutionTimeline.displayName = "ExecutionTimeline"
