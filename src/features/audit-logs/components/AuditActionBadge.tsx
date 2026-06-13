import { cn } from "@/lib/utils"

interface AuditActionBadgeProps {
  action: string
  className?: string
}

export const AuditActionBadge = ({ action, className }: AuditActionBadgeProps) => {
  const normAction = action.toUpperCase()

  // Determine badge colors based on action type
  let colorClasses = "bg-muted text-muted-foreground border-muted-foreground/25"

  if (normAction.includes("CREATE") || normAction === "CREATE") {
    colorClasses = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
  } else if (
    normAction.includes("UPDATE") ||
    normAction.includes("PUBLISH") ||
    normAction === "UPDATE"
  ) {
    colorClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
  } else if (
    normAction.includes("EXECUTE") ||
    normAction === "EXECUTE" ||
    normAction === "RUN"
  ) {
    colorClasses = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
  } else if (
    normAction.includes("REVOKE") ||
    normAction.includes("DELETE") ||
    normAction.includes("REMOVE") ||
    normAction === "DELETE"
  ) {
    colorClasses = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
  } else if (normAction.includes("LOGIN") || normAction === "LOGIN") {
    colorClasses = "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20"
  } else if (normAction.includes("LOGOUT") || normAction === "LOGOUT") {
    colorClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
  } else if (normAction.includes("INVITE") || normAction === "INVITED") {
    colorClasses = "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20"
  }

  // Format label for display (e.g. WORKFLOW_CREATED -> Workflow Created)
  const label = normAction
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border select-none shrink-0",
        colorClasses,
        className
      )}
    >
      {label}
    </span>
  )
}
