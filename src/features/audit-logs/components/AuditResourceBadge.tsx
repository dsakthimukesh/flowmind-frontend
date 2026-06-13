import { cn } from "@/lib/utils"

interface AuditResourceBadgeProps {
  resourceType: string
  className?: string
}

export const AuditResourceBadge = ({ resourceType, className }: AuditResourceBadgeProps) => {
  const normType = resourceType.toUpperCase()

  let colorClasses = "bg-muted text-muted-foreground border-muted-foreground/25"

  switch (normType) {
    case "WORKFLOW":
      colorClasses = "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
      break
    case "USER":
      colorClasses = "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20"
      break
    case "EXECUTION":
      colorClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      break
    case "API_KEY":
      colorClasses = "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/20"
      break
    case "ORGANIZATION":
      colorClasses = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
      break
  }

  // Capitalize for display (e.g. API_KEY -> Api Key)
  const label = normType
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border select-none shrink-0",
        colorClasses,
        className
      )}
    >
      {label}
    </span>
  )
}
