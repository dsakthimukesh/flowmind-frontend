import React from "react"
import { Terminal } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const PromptNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("PROMPT", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Prompt"
      description="Executes a system prompt instruction using LLMs."
      icon={<Terminal className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-blue-500/30"
      iconColorClass="text-blue-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

PromptNode.displayName = "PromptNode"
