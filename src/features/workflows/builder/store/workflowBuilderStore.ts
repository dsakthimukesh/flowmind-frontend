import { create } from "zustand"
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "reactflow"
import { type BuilderNode, type BuilderEdge } from "../types/builder.types"
import { type ValidationResult } from "../validation/types/validation.types"

interface WorkflowBuilderState {
  nodes: BuilderNode[]
  edges: BuilderEdge[]
  selectedNode: BuilderNode | null
  validationResult: ValidationResult | null
  
  // History and UX state
  past: { nodes: BuilderNode[]; edges: BuilderEdge[] }[]
  future: { nodes: BuilderNode[]; edges: BuilderEdge[] }[]
  isDirty: boolean
  copiedNode: BuilderNode | null
  searchQuery: string

  setNodes: (nodes: BuilderNode[]) => void
  setEdges: (edges: BuilderEdge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  updateNodeConfig: (nodeId: string, config: any) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  clearSelection: () => void
  setValidationResult: (result: ValidationResult | null) => void
  
  // UX Enhancements Actions
  setDirty: (isDirty: boolean) => void
  takeSnapshot: () => void
  undo: () => void
  redo: () => void
  copyNode: (node: BuilderNode | null) => void
  pasteNode: (position?: { x: number; y: number }) => void
  duplicateNode: (nodeId: string) => void
  setSearchQuery: (query: string) => void
  restoreDraft: (nodes: BuilderNode[], edges: BuilderEdge[]) => void
  
  reset: () => void
}

export const useWorkflowBuilderStore = create<WorkflowBuilderState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  validationResult: null,
  
  // Initial UX states
  past: [],
  future: [],
  isDirty: false,
  copiedNode: null,
  searchQuery: "",

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes) as BuilderNode[]
      
      // Sync selectedNode based on select changes
      let selectedNode = state.selectedNode
      const selectChange = changes.find((c) => c.type === "select")
      if (selectChange && "selected" in selectChange) {
        if (selectChange.selected) {
          selectedNode = nextNodes.find((n) => n.id === selectChange.id) || null
        } else if (selectedNode?.id === selectChange.id) {
          selectedNode = null
        }
      }

      // Check if this change involves deletion (type === "remove")
      const hasRemoval = changes.some((c) => c.type === "remove")
      let past = state.past
      let future = state.future
      let isDirty = state.isDirty

      if (hasRemoval) {
        const nodesClone = JSON.parse(JSON.stringify(state.nodes))
        const edgesClone = JSON.parse(JSON.stringify(state.edges))
        past = [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)
        future = []
        isDirty = true
      }

      return {
        nodes: nextNodes,
        selectedNode,
        past,
        future,
        isDirty,
      }
    }),

  onEdgesChange: (changes) =>
    set((state) => {
      const nextEdges = applyEdgeChanges(changes, state.edges) as BuilderEdge[]
      
      const hasRemoval = changes.some((c) => c.type === "remove")
      let past = state.past
      let future = state.future
      let isDirty = state.isDirty

      if (hasRemoval) {
        const nodesClone = JSON.parse(JSON.stringify(state.nodes))
        const edgesClone = JSON.parse(JSON.stringify(state.edges))
        past = [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)
        future = []
        isDirty = true
      }

      return {
        edges: nextEdges,
        past,
        future,
        isDirty,
      }
    }),

  onConnect: (connection) =>
    set((state) => {
      const nextEdges = addEdge(connection, state.edges) as BuilderEdge[]
      
      // Take snapshot before adding the connection
      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newPast = [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)

      return {
        edges: nextEdges,
        past: newPast,
        future: [],
        isDirty: true,
      }
    }),

  updateNodeConfig: (nodeId, config) =>
    set((state) => {
      const nextNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                ...config,
              },
            },
          }
        }
        return node
      })

      const selectedNode =
        state.selectedNode?.id === nodeId
          ? nextNodes.find((n) => n.id === nodeId) || null
          : state.selectedNode

      return {
        nodes: nextNodes,
        selectedNode,
        isDirty: true,
      }
    }),

  updateNodeLabel: (nodeId, label) =>
    set((state) => {
      const nextNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          }
        }
        return node
      })

      const selectedNode =
        state.selectedNode?.id === nodeId
          ? nextNodes.find((n) => n.id === nodeId) || null
          : state.selectedNode

      return {
        nodes: nextNodes,
        selectedNode,
        isDirty: true,
      }
    }),

  clearSelection: () =>
    set({
      selectedNode: null,
    }),

  setValidationResult: (validationResult) => set({ validationResult }),

  // UX Actions implementation
  setDirty: (isDirty) => set({ isDirty }),

  takeSnapshot: () =>
    set((state) => {
      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newPast = [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)
      return {
        past: newPast,
        future: [],
        isDirty: true,
      }
    }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {}

      const previous = state.past[state.past.length - 1]
      const newPast = state.past.slice(0, state.past.length - 1)
      
      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newFuture = [{ nodes: nodesClone, edges: edgesClone }, ...state.future]

      return {
        nodes: previous.nodes,
        edges: previous.edges,
        past: newPast,
        future: newFuture,
        isDirty: true,
        selectedNode: previous.nodes.find((n) => n.id === state.selectedNode?.id) || null,
      }
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return {}

      const next = state.future[0]
      const newFuture = state.future.slice(1)

      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newPast = [...state.past, { nodes: nodesClone, edges: edgesClone }]

      return {
        nodes: next.nodes,
        edges: next.edges,
        past: newPast,
        future: newFuture,
        isDirty: true,
        selectedNode: next.nodes.find((n) => n.id === state.selectedNode?.id) || null,
      }
    }),

  copyNode: (node) => set({ copiedNode: node }),

  pasteNode: (position) =>
    set((state) => {
      if (!state.copiedNode) return {}

      const original = state.copiedNode
      const newId = `node_${Date.now()}`
      const newLabel = `${original.data.label} (Copy)`
      const offset = 40

      const newPosition = position || {
        x: original.position.x + offset,
        y: original.position.y + offset,
      }

      const newNode: BuilderNode = {
        ...original,
        id: newId,
        position: newPosition,
        selected: true,
        data: {
          ...original.data,
          label: newLabel,
        },
      }

      // Deselect existing selected nodes
      const deselectedNodes = state.nodes.map((n) => ({ ...n, selected: false }))
      const nextNodes = [...deselectedNodes, newNode]

      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newPast = [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)

      return {
        nodes: nextNodes,
        selectedNode: newNode,
        past: newPast,
        future: [],
        isDirty: true,
      }
    }),

  duplicateNode: (nodeId) =>
    set((state) => {
      const targetNode = state.nodes.find((n) => n.id === nodeId)
      if (!targetNode) return {}

      const newId = `node_${Date.now()}`
      const newLabel = `${targetNode.data.label} (Copy)`
      const offset = 40

      const newNode: BuilderNode = {
        ...targetNode,
        id: newId,
        position: {
          x: targetNode.position.x + offset,
          y: targetNode.position.y + offset,
        },
        selected: true,
        data: {
          ...targetNode.data,
          label: newLabel,
        },
      }

      const deselectedNodes = state.nodes.map((n) => ({ ...n, selected: false }))
      const nextNodes = [...deselectedNodes, newNode]

      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newPast = [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)

      return {
        nodes: nextNodes,
        selectedNode: newNode,
        past: newPast,
        future: [],
        isDirty: true,
      }
    }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  restoreDraft: (nodes, edges) =>
    set((state) => {
      const nodesClone = JSON.parse(JSON.stringify(state.nodes))
      const edgesClone = JSON.parse(JSON.stringify(state.edges))
      const newPast = state.nodes.length > 0 
        ? [...state.past, { nodes: nodesClone, edges: edgesClone }].slice(-50)
        : state.past

      return {
        nodes,
        edges,
        past: newPast,
        future: [],
        isDirty: true,
        selectedNode: null,
      }
    }),

  reset: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      validationResult: null,
      past: [],
      future: [],
      isDirty: false,
      copiedNode: null,
      searchQuery: "",
    }),
}))
