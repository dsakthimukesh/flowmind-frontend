import React from "react"

interface LogLevelBadgeProps {
  level: "INFO" | "WARN" | "ERROR" | string
}

export const LogLevelBadge = React.memo(({ level }: LogLevelBadgeProps) => {
  const normLevel = level?.toUpperCase() || "INFO"
  switch (normLevel) {
    case "ERROR":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          ERROR
        </span>
      )
    case "WARN":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          WARN
        </span>
      )
    case "INFO":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          INFO
        </span>
      )
  }
})

LogLevelBadge.displayName = "LogLevelBadge"
