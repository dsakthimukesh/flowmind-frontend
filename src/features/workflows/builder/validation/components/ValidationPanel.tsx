import React from "react"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { ValidationSummary } from "./ValidationSummary"
import { ValidationErrorItem } from "./ValidationErrorItem"
import { CheckCircle2 } from "lucide-react"

export const ValidationPanel: React.FC = () => {
  const result = useWorkflowBuilderStore((state) => state.validationResult)

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Panel Header */}
      <div className="p-4 border-b border-border flex flex-col gap-1 shrink-0">
        <h3 className="text-base font-semibold">Workflow Validation</h3>
        <p className="text-xs text-muted-foreground">
          Real-time check for workflow structure, parameters, and connectivity.
        </p>
      </div>

      {/* Summary Section */}
      <div className="p-4 shrink-0">
        <ValidationSummary result={result} />
      </div>

      {/* Errors List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 select-none">
        {!result || result.valid || result.errors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-[240px]">
              <p className="font-medium text-sm text-foreground">No issues found</p>
              <p className="text-xs text-muted-foreground">
                Your workflow is perfectly structured and all configured parameters are valid.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Errors ({result.errors.length})
            </h4>
            <div className="flex flex-col gap-2">
              {result.errors.map((error) => (
                <ValidationErrorItem key={error.id} error={error} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
