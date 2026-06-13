import React from "react"
import { MessageSquare } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const ChatNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("CHAT", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Chat"
      description="Runs a multi-turn conversation session agent."
      icon={<MessageSquare className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-violet-500/30"
      iconColorClass="text-violet-500"
      inputs={true}
      outputs={true}
      isConfigured={isConfigured}
      isInvalid={isInvalid}
    />
  )
})

ChatNode.displayName = "ChatNode"
