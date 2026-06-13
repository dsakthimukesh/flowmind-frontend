import React from "react"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import { PromptNodeForm } from "./forms/PromptNodeForm"
import { ChatNodeForm } from "./forms/ChatNodeForm"
import { ConditionNodeForm } from "./forms/ConditionNodeForm"
import { HttpRequestNodeForm } from "./forms/HttpRequestNodeForm"
import { DelayNodeForm } from "./forms/DelayNodeForm"
import { RagQueryNodeForm } from "./forms/RagQueryNodeForm"
import { TransformNodeForm } from "./forms/TransformNodeForm"
import { SummarizeNodeForm } from "./forms/SummarizeNodeForm"

export const NodeConfigDrawer = React.memo(() => {
  const selectedNode = useWorkflowBuilderStore((state) => state.selectedNode)
  const updateNodeLabel = useWorkflowBuilderStore((state) => state.updateNodeLabel)
  const clearSelection = useWorkflowBuilderStore((state) => state.clearSelection)

  const open = selectedNode !== null

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      clearSelection()
    }
  }

  if (!selectedNode) return null

  const renderForm = () => {
    const config = selectedNode.data?.config
    switch (selectedNode.type) {
      case "PROMPT":
        return <PromptNodeForm nodeId={selectedNode.id} config={config} />
      case "CHAT":
        return <ChatNodeForm nodeId={selectedNode.id} config={config} />
      case "CONDITION":
        return <ConditionNodeForm nodeId={selectedNode.id} config={config} />
      case "HTTP_REQUEST":
        return <HttpRequestNodeForm nodeId={selectedNode.id} config={config} />
      case "DELAY":
        return <DelayNodeForm nodeId={selectedNode.id} config={config} />
      case "RAG_QUERY":
        return <RagQueryNodeForm nodeId={selectedNode.id} config={config} />
      case "TRANSFORM":
        return <TransformNodeForm nodeId={selectedNode.id} config={config} />
      case "SUMMARIZE":
        return <SummarizeNodeForm nodeId={selectedNode.id} config={config} />
      default:
        return (
          <div className="text-xs text-muted-foreground italic">
            This node type has no custom configuration parameters.
          </div>
        )
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto rounded-t-2xl p-6 select-none">
        <SheetHeader className="border-b border-border pb-4 mb-4 text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
            {selectedNode.type.replace("_", " ")}
          </span>
          <SheetTitle>Node Settings</SheetTitle>
          <SheetDescription>Configure parameters for this workflow step.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Node Label */}
          <div className="space-y-2">
            <label htmlFor="config-drawer-node-label" className="text-xs font-bold text-muted-foreground">
              Display Label
            </label>
            <Input
              id="config-drawer-node-label"
              value={selectedNode.data?.label || ""}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              placeholder="e.g. LLM Prompt"
              className="h-9 text-sm rounded-lg"
            />
          </div>

          {/* Config Forms */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            {renderForm()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
})

NodeConfigDrawer.displayName = "NodeConfigDrawer"
