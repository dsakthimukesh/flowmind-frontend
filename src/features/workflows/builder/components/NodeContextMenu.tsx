import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Copy, Trash2, Layers } from "lucide-react"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

interface NodeContextMenuProps {
  nodeId: string
  x: number
  y: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  x,
  y,
  open,
  onOpenChange,
}) => {
  const { nodes, edges, onNodesChange, onEdgesChange, copyNode, duplicateNode } =
    useWorkflowBuilderStore()

  const node = nodes.find((n) => n.id === nodeId)

  const handleCopy = () => {
    if (node) {
      copyNode(node)
    }
    onOpenChange(false)
  }

  const handleDuplicate = () => {
    duplicateNode(nodeId)
    onOpenChange(false)
  }

  const handleDelete = () => {
    // Delete connected edges first to prevent floating connections
    const connectedEdges = edges.filter((e) => e.source === nodeId || e.target === nodeId)
    if (connectedEdges.length > 0) {
      onEdgesChange(connectedEdges.map((e) => ({ id: e.id, type: "remove" })))
    }
    // Delete the node
    onNodesChange([{ id: nodeId, type: "remove" }])
    onOpenChange(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: "1px",
          height: "1px",
        }}
      />
      <DropdownMenuContent
        align="start"
        className="w-44 select-none"
        style={{
          position: "fixed",
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
          <Copy className="h-4 w-4" />
          <span>Copy Node</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate} className="gap-2 cursor-pointer">
          <Layers className="h-4 w-4" />
          <span>Duplicate Node</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Node</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
