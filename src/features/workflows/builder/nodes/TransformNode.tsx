import React from "react"
import { Binary } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const TransformNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("TRANSFORM", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Transform"
      description="Runs code snippet manipulations to format payload variables."
      icon={<Binary className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-pink-500/30"
      iconColorClass="text-pink-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

TransformNode.displayName = "TransformNode"
