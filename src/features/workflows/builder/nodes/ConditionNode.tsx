import React from "react"
import { GitFork } from "lucide-react"
import { BaseNode } from "./BaseNode"
import { type NodeProps, Handle, Position } from "reactflow"
import { isNodeConfigured } from "../config/isNodeConfigured"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const ConditionNode = React.memo(({ id, data, selected }: NodeProps) => {
  const isConfigured = isNodeConfigured("CONDITION", data?.config)
  const isInvalid = useWorkflowBuilderStore((state) =>
    state.validationResult?.errors.some((err) => err.nodeId === id)
  )

  return (
    <BaseNode
      title="Condition"
      description="Evaluates custom rules and routes based on boolean branches."
      icon={<GitFork className="h-4 w-4" />}
      selected={selected}
      borderColorClass="border-amber-500/30"
      iconColorClass="text-amber-500"
      inputs={true}
      outputs={false} // Disable default output handle
      isConfigured={isConfigured}
      isInvalid={isInvalid}
      customHandles={
        <>
          {/* True Branch Handle */}
          <div className="absolute top-[30%] -right-1 flex items-center transform translate-y-[-50%]">
            <span className="text-[8px] font-extrabold text-emerald-500 mr-2 select-none">TRUE</span>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              style={{ top: "30%" }}
              className="w-2.5 h-2.5 border border-background bg-emerald-500 rounded-full"
            />
          </div>
          {/* False Branch Handle */}
          <div className="absolute top-[70%] -right-1 flex items-center transform translate-y-[-50%]">
            <span className="text-[8px] font-extrabold text-destructive mr-2 select-none">FALSE</span>
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              style={{ top: "70%" }}
              className="w-2.5 h-2.5 border border-background bg-destructive rounded-full"
            />
          </div>
        </>
      }
    />
  )
})

ConditionNode.displayName = "ConditionNode"
