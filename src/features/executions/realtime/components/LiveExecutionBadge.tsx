import React from "react"

export const LiveExecutionBadge = React.memo(() => {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white dark:bg-blue-500 tracking-wider shrink-0 select-none animate-pulse">
      LIVE
    </span>
  )
})

LiveExecutionBadge.displayName = "LiveExecutionBadge"
