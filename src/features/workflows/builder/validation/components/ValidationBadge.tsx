import React from "react"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"

export const ValidationBadge: React.FC = () => {
  const result = useWorkflowBuilderStore((state) => state.validationResult)

  if (!result || result.valid || result.errors.length === 0) {
    return null
  }

  return (
    <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-1.5 text-[10px] font-bold leading-none text-white bg-destructive rounded-full">
      {result.errors.length}
    </span>
  )
}
