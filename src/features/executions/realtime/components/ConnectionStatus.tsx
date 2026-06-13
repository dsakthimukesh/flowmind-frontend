import React from "react"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useRealtimeStore } from "../store/realtimeStore"

export const ConnectionStatus = React.memo(() => {
  const { connected, reconnecting } = useRealtimeStore()

  if (connected) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm animate-in fade-in duration-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Wifi className="h-3.5 w-3.5 mr-0.5 shrink-0" />
        Connected
      </span>
    )
  }

  if (reconnecting) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm animate-in fade-in duration-300">
        <RefreshCw className="h-3 w-3 animate-spin shrink-0" />
        Reconnecting...
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-sm animate-in fade-in duration-300">
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      Disconnected
    </span>
  )
})

ConnectionStatus.displayName = "ConnectionStatus"
