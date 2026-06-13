import React from "react"

export const RealtimeIndicator = React.memo(() => {
  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-muted-foreground bg-muted/30 border border-border px-2 py-0.5 rounded-full select-none">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
      </span>
      <span>LIVE FEED</span>
    </div>
  )
})

RealtimeIndicator.displayName = "RealtimeIndicator"
