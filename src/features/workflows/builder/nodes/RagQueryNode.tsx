import React from "react"
import { Database } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const RagQueryNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("RAG_QUERY", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="RAG Query"
      description="Queries vector stores and returns related text context."
      icon={<Database className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-indigo-500/30"
      iconColorClass="text-indigo-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

RagQueryNode.displayName = "RagQueryNode"
