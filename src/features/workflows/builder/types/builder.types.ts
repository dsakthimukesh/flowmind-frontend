import { type Node, type Edge } from "reactflow"

export interface BuilderNodeData {
  label: string
  description?: string
  icon?: string
  [key: string]: any
}

export interface BuilderNode extends Node<BuilderNodeData> {
  type: string
}

export type BuilderEdge = Edge

export interface WorkflowDefinition {
  nodes: BuilderNode[]
  edges: BuilderEdge[]
}
