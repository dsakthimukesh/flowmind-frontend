import React from "react"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"
import { Input } from "@/components/ui/input"
import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"

import { PromptNodeForm } from "./forms/PromptNodeForm"
import { ChatNodeForm } from "./forms/ChatNodeForm"
import { ConditionNodeForm } from "./forms/ConditionNodeForm"
import { HttpRequestNodeForm } from "./forms/HttpRequestNodeForm"
import { DelayNodeForm } from "./forms/DelayNodeForm"
import { RagQueryNodeForm } from "./forms/RagQueryNodeForm"
import { TransformNodeForm } from "./forms/TransformNodeForm"
import { SummarizeNodeForm } from "./forms/SummarizeNodeForm"

export const NodeConfigPanel = React.memo(() => {
  const selectedNode = useWorkflowBuilderStore((state) => state.selectedNode)
  const updateNodeLabel = useWorkflowBuilderStore((state) => state.updateNodeLabel)
  const clearSelection = useWorkflowBuilderStore((state) => state.clearSelection)

  if (!selectedNode) {
    return (
      <div className="p-6 flex flex-col justify-center items-center text-center select-none h-full bg-card/50">
        <div className="p-3 bg-muted rounded-full text-muted-foreground mb-3">
          <Settings className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No Node Selected</h3>
        <p className="text-xs text-muted-foreground max-w-[200px] mt-1 leading-relaxed">
          Select a node on the canvas to configure its settings.
        </p>
      </div>
    )
  }

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
            This node type has no custom configuration parameters in this phase.
          </div>
        )
    }
  }

  return (
    <div className="p-6 flex flex-col h-full overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
            {selectedNode.type.replace("_", " ")}
          </span>
          <h2 className="text-sm font-bold text-foreground">Node Settings</h2>
        </div>
        <Button
          id="config-close-button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
          onClick={clearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Node Label Editing */}
        <div className="space-y-2">
          <label htmlFor="config-node-label" className="text-xs font-bold text-muted-foreground">
            Display Label
          </label>
          <Input
            id="config-node-label"
            value={selectedNode.data?.label || ""}
            onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
            placeholder="e.g. LLM Prompt"
            className="h-9 text-sm rounded-lg"
          />
        </div>

        {/* Configurations Fields Forms */}
        <div className="space-y-4 pt-2 border-t border-border/60">
          {renderForm()}
        </div>
      </div>
    </div>
  )
})

NodeConfigPanel.displayName = "NodeConfigPanel"
