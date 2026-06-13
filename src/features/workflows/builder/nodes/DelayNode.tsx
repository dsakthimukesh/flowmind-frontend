import React from "react"
import { Clock } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const DelayNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("DELAY", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Delay"
      description="Pauses workflow executions for a specified duration."
      icon={<Clock className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-orange-500/30"
      iconColorClass="text-orange-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

DelayNode.displayName = "DelayNode"
