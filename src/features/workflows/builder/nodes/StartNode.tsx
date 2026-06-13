import React from "react"
import { Play } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const StartNode = React.memo(({ id, selected }: NodeProps) => {
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Start"
      description="Entrypoint trigger. Initiates workflow execution runs."
      icon={<Play className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-emerald-500/30"
      iconColorClass="text-emerald-500"
      inputs={false}
      outputs={true}
      showBadge={false}
      isInvalid={isInvalid}
    />
  )
})

StartNode.displayName = "StartNode"
