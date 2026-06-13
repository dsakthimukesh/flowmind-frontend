import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { socketClient } from "@/lib/socket/socketClient"
import { queryKeys } from "@/app/config/queryKeys"
import {
  type ExecutionStartedEvent,
  type ExecutionCompletedEvent,
  type ExecutionFailedEvent,
} from "../types/realtime.types"

export const useRealtimeMetrics = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = socketClient.getSocket()
    if (!socket) return

    const updateMetricsCache = (updater: (oldData: any) => any) => {
      // Update executions page metrics
      queryClient.setQueryData<any>(queryKeys.executions.metrics, (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: updater(old.data),
        }
      })

      // Update dashboard page metrics
      queryClient.setQueryData<any>(queryKeys.dashboard.metrics, (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: updater(old.data),
        }
      })
    }

    const handleStarted = (_event: ExecutionStartedEvent) => {
      updateMetricsCache((data) => {
        if (!data) return data
        const total = (data.total !== undefined ? data.total : data.totalExecutions ?? 0) + 1
        const running = (data.running ?? 0) + 1
        return {
          ...data,
          total,
          totalExecutions: total,
          running,
        }
      })
    }

    const handleCompleted = (_event: ExecutionCompletedEvent) => {
      updateMetricsCache((data) => {
        if (!data) return data
        const running = Math.max(0, (data.running ?? 0) - 1)
        const success = (data.success ?? 0) + 1
        const failed = data.failed ?? 0
        const total = data.total !== undefined ? data.total : data.totalExecutions ?? (success + failed)
        const successRate = total > 0 ? success / total : 0
        return {
          ...data,
          running,
          success,
          successRate,
        }
      })
    }

    const handleFailed = (_event: ExecutionFailedEvent) => {
      updateMetricsCache((data) => {
        if (!data) return data
        const running = Math.max(0, (data.running ?? 0) - 1)
        const failed = (data.failed ?? 0) + 1
        const success = data.success ?? 0
        const total = data.total !== undefined ? data.total : data.totalExecutions ?? (success + failed)
        const successRate = total > 0 ? success / total : 0
        return {
          ...data,
          running,
          failed,
          successRate,
        }
      })
    }

    socket.on("execution.started", handleStarted)
    socket.on("execution.completed", handleCompleted)
    socket.on("execution.failed", handleFailed)

    return () => {
      socket.off("execution.started", handleStarted)
      socket.off("execution.completed", handleCompleted)
      socket.off("execution.failed", handleFailed)
    }
  }, [queryClient])
}
