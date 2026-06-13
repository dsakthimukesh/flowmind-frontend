import React from "react"
import { Globe } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const HttpRequestNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("HTTP_REQUEST", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="HTTP Request"
      description="Triggers endpoints using GET, POST, or PUT calls."
      icon={<Globe className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-cyan-500/30"
      iconColorClass="text-cyan-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

HttpRequestNode.displayName = "HttpRequestNode"
