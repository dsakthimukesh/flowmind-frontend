import React from "react"
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import { type ValidationResult } from "../types/validation.types"

interface ValidationSummaryProps {
  result: ValidationResult | null
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg border border-dashed">
        <AlertTriangle className="h-4 w-4 animate-pulse" />
        <span>Validating workflow configuration...</span>
      </div>
    )
  }

  const { valid, errors } = result

  if (valid) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400">
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-sm">
          <h4 className="font-semibold text-green-600 dark:text-green-400">Workflow is valid</h4>
          <p className="text-xs text-muted-foreground">
            All structural validations and configuration checks passed successfully. Ready to save or publish!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div className="space-y-0.5 text-sm">
        <h4 className="font-semibold text-destructive">Issues detected</h4>
        <p className="text-xs text-muted-foreground">
          {errors.length} {errors.length === 1 ? "validation issue needs" : "validation issues need"} to be resolved before publishing.
        </p>
      </div>
    </div>
  )
}
