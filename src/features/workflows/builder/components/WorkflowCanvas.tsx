import React, { useRef, useCallback, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"

import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"
import { nodeTypes } from "../nodes/nodeTypes"
import { EmptyCanvas } from "./EmptyCanvas"
import { type BuilderNode } from "../types/builder.types"
import { NodeContextMenu } from "./NodeContextMenu"
import { NodeSearch } from "./NodeSearch"

export const WorkflowCanvas = React.memo(() => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const { project } = useReactFlow()
  
  // Right-click context menu state
  const [menu, setMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null)

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    takeSnapshot,
  } = useWorkflowBuilderStore()

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) return

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const label = type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ")

      const newNode: BuilderNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: {
          label,
          description: `Custom ${label} workflow action block.`,
        },
      }

      // Snapshot current state in undo history before adding node
      takeSnapshot()
      setNodes([...nodes, newNode])
    },
    [reactFlowInstance, nodes, project, setNodes, takeSnapshot]
  )

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance)
      setTimeout(() => {
        instance.fitView({ padding: 0.2 })
      }, 50)
    },
    []
  )

  const onNodeDragStop = useCallback(() => {
    // Save history snapshot when node dragging stops
    takeSnapshot()
  }, [takeSnapshot])

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault()
    setMenu({
      nodeId: node.id,
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  return (
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper}>
      {/* Node Search Overlay (floating top-left) */}
      <NodeSearch />

      {nodes.length === 0 && <EmptyCanvas />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        deleteKeyCode={["BackendDelete", "Delete"]}
        fitViewOptions={{ padding: 0.2 }}
        className="bg-zinc-50 dark:bg-zinc-950/20"
      >
        <Background gap={16} size={1} />
        
        {/* React Flow official minimap */}
        <MiniMap
          className="bg-card border border-border rounded-xl shadow-lg !bottom-6 !left-6 shrink-0"
          nodeColor="#2563eb"
          maskColor="rgba(0, 0, 0, 0.05)"
          style={{ width: 120, height: 80 }}
        />
        
        {/* React Flow official viewport controls */}
        <Controls 
          className="bg-card border border-border p-1 rounded-xl shadow-lg !bottom-28 !left-6"
        />
      </ReactFlow>

      {/* Programmatic node context menu overlay */}
      {menu && (
        <NodeContextMenu
          nodeId={menu.nodeId}
          x={menu.x}
          y={menu.y}
          open={!!menu}
          onOpenChange={(open) => !open && setMenu(null)}
        />
      )}
    </div>
  )
})

WorkflowCanvas.displayName = "WorkflowCanvas"
