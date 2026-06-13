import React from "react"
import { FileText } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const SummarizeNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("SUMMARIZE", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Summarize"
      description="Condenses raw body input into brief bulleted summaries."
      icon={<FileText className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-teal-500/30"
      iconColorClass="text-teal-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

SummarizeNode.displayName = "SummarizeNode"
