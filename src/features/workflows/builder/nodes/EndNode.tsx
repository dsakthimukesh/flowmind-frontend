import React from "react"
import { Square } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const EndNode = React.memo(({ id, selected }: NodeProps) => {
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="End"
      description="Termination trigger. Closes and finishes executions."
      icon={<Square className="h-4 w-4 fill-destructive text-destructive" />}
      selected={selected}
      borderColorClass="border-destructive/30"
      iconColorClass="text-destructive"
      inputs={true}
      outputs={false}
      showBadge={false}
      isInvalid={isInvalid}
    />
  )
})

EndNode.displayName = "EndNode"
