import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { socketClient } from "@/lib/socket/socketClient"
import { useRealtimeStore } from "../store/realtimeStore"
import { queryKeys } from "@/app/config/queryKeys"
import {
  type ExecutionStartedEvent,
  type ExecutionRunningEvent,
  type ExecutionCompletedEvent,
  type ExecutionFailedEvent,
} from "../types/realtime.types"
import { type WorkflowExecution } from "../../types/execution.types"

export const useExecutionRealtime = (executionId?: string) => {
  const queryClient = useQueryClient()
  const { updateExecution } = useRealtimeStore()

  useEffect(() => {
    const socket = socketClient.getSocket()
    if (!socket) return

    const handleStarted = (event: ExecutionStartedEvent) => {
      // Update active executions Zustand list
      updateExecution(event.executionId, "PENDING")

      // Find workflow name from workflows cache
      const workflowsData = queryClient.getQueryData<any>(queryKeys.workflows.all)
      const workflow = workflowsData?.data?.find((w: any) => w.id === event.workflowId)
      const workflowName = workflow?.name || "Workflow Run"

      const newExecution: WorkflowExecution = {
        id: event.executionId,
        workflowId: event.workflowId,
        workflowName,
        status: "PENDING",
        startedAt: event.startedAt,
        completedAt: null,
        duration: null,
      }

      // Prepend to list queries
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.executions.all },
        (old: any) => {
          if (!old) return old
          if (old.data?.some((x: any) => x.id === event.executionId)) return old
          return {
            ...old,
            data: [newExecution, ...(old.data || [])],
            meta: old.meta
              ? {
                  ...old.meta,
                  totalItems: old.meta.totalItems + 1,
                }
              : undefined,
          }
        }
      )
    }

    const handleRunning = (event: ExecutionRunningEvent) => {
      updateExecution(event.executionId, "RUNNING")

      // Update in List
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.executions.all },
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            data: (old.data || []).map((x: any) =>
              x.id === event.executionId ? { ...x, status: "RUNNING" } : x
            ),
          }
        }
      )

      // Update in Details if matching
      if (executionId === event.executionId) {
        queryClient.setQueryData<any>(
          queryKeys.executions.detail(event.executionId),
          (old: any) => {
            if (!old) return old
            return {
              ...old,
              data: {
                ...old.data,
                status: "RUNNING",
              },
            }
          }
        )
      }
    }

    const handleCompleted = (event: ExecutionCompletedEvent) => {
      updateExecution(event.executionId, "SUCCESS")

      // Update in List
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.executions.all },
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            data: (old.data || []).map((x: any) => {
              if (x.id !== event.executionId) return x
              const duration = new Date(event.completedAt).getTime() - new Date(x.startedAt).getTime()
              return {
                ...x,
                status: "SUCCESS",
                completedAt: event.completedAt,
                duration,
              }
            }),
          }
        }
      )

      // Update in Details if matching
      if (executionId === event.executionId) {
        queryClient.setQueryData<any>(
          queryKeys.executions.detail(event.executionId),
          (old: any) => {
            if (!old) return old
            const duration = new Date(event.completedAt).getTime() - new Date(old.data.startedAt).getTime()
            return {
              ...old,
              data: {
                ...old.data,
                status: "SUCCESS",
                completedAt: event.completedAt,
                duration,
              },
            }
          }
        )
      }
    }

    const handleFailed = (event: ExecutionFailedEvent) => {
      updateExecution(event.executionId, "FAILED")
      const completedAt = new Date().toISOString()

      // Update in List
      queryClient.setQueriesData<any>(
        { queryKey: queryKeys.executions.all },
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            data: (old.data || []).map((x: any) => {
              if (x.id !== event.executionId) return x
              const duration = new Date(completedAt).getTime() - new Date(x.startedAt).getTime()
              return {
                ...x,
                status: "FAILED",
                completedAt,
                duration,
                errorMessage: event.error,
              }
            }),
          }
        }
      )

      // Update in Details if matching
      if (executionId === event.executionId) {
        queryClient.setQueryData<any>(
          queryKeys.executions.detail(event.executionId),
          (old: any) => {
            if (!old) return old
            const duration = new Date(completedAt).getTime() - new Date(old.data.startedAt).getTime()
            return {
              ...old,
              data: {
                ...old.data,
                status: "FAILED",
                completedAt,
                duration,
                errorMessage: event.error,
              },
            }
          }
        )
      }
    }

    socket.on("execution.started", handleStarted)
    socket.on("execution.running", handleRunning)
    socket.on("execution.completed", handleCompleted)
    socket.on("execution.failed", handleFailed)

    return () => {
      socket.off("execution.started", handleStarted)
      socket.off("execution.running", handleRunning)
      socket.off("execution.completed", handleCompleted)
      socket.off("execution.failed", handleFailed)
    }
  }, [executionId, queryClient, updateExecution])
}
