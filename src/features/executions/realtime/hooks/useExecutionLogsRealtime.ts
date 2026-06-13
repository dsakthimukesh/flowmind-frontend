import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { socketClient } from "@/lib/socket/socketClient"
import { type ExecutionLogEvent } from "../types/realtime.types"
import { type ExecutionLog } from "../../types/execution.types"

export const useExecutionLogsRealtime = (executionId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!executionId) return

    const socket = socketClient.getSocket()
    if (!socket) return

    const handleLog = (event: ExecutionLogEvent) => {
      if (event.executionId !== executionId) return

      const newLog: ExecutionLog = {
        id: `${event.executionId}-${event.timestamp}-${Math.random()}`,
        timestamp: event.timestamp,
        nodeId: event.nodeId,
        level: event.level,
        message: event.message,
      }

      queryClient.setQueriesData<any>(
        { queryKey: ["execution-logs", executionId] },
        (old: any) => {
          if (!old) return old
          // Avoid duplicate logs based on timestamp, level, message, and nodeId
          const exists = (old.data || []).some(
            (l: any) =>
              l.timestamp === event.timestamp &&
              l.message === event.message &&
              l.nodeId === event.nodeId &&
              l.level === event.level
          )
          if (exists) return old

          return {
            ...old,
            data: [...(old.data || []), newLog],
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

    socket.on("execution.log", handleLog)

    return () => {
      socket.off("execution.log", handleLog)
    }
  }, [executionId, queryClient])
}
