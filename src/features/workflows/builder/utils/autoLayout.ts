import dagre from "dagre"
import { type BuilderNode, type BuilderEdge } from "../types/builder.types"

/**
 * Computes standard directed graph layout coordinates using Dagre.
 */
export const getLayoutedElements = (
  nodes: BuilderNode[],
  edges: BuilderEdge[],
  direction = "TB"
): { nodes: BuilderNode[]; edges: BuilderEdge[] } => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  
  // TB: Top-to-Bottom, nodesep: node separation spacing, ranksep: hierarchy rows spacing
  dagreGraph.setGraph({ rankdir: direction, nodesep: 70, ranksep: 90 })

  nodes.forEach((node) => {
    // Standard block dimensions in the FlowMind AI canvas
    dagreGraph.setNode(node.id, { width: 220, height: 90 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: Math.round(nodeWithPosition.x - 110), // Offset by half width to center position
        y: Math.round(nodeWithPosition.y - 45),  // Offset by half height to center position
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

/**
 * Rearranges nodes and animates the position transition smoothly over 400ms.
 */
export const animateLayout = (
  nodes: BuilderNode[],
  edges: BuilderEdge[],
  setNodes: (nodes: BuilderNode[]) => void,
  takeSnapshot: () => void
) => {
  if (nodes.length === 0) return

  // Calculate layouted coordinates
  const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges)

  // Cache current position coordinates
  const initialPositions = nodes.reduce((acc, node) => {
    acc[node.id] = { x: node.position.x, y: node.position.y }
    return acc
  }, {} as Record<string, { x: number; y: number }>)

  const duration = 400 // Animation duration in ms
  const start = performance.now()

  const step = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)

    // EaseInOutCubic transition interpolation
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const nextNodes = layoutedNodes.map((node) => {
      const startPos = initialPositions[node.id] || { x: 0, y: 0 }
      const targetPos = node.position
      return {
        ...node,
        position: {
          x: startPos.x + (targetPos.x - startPos.x) * ease,
          y: startPos.y + (targetPos.y - startPos.y) * ease,
        },
      }
    })

    setNodes(nextNodes)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      // Secure exact layout coordinates and save this layout state in the undo history
      setNodes(layoutedNodes)
      takeSnapshot()
    }
  }

  requestAnimationFrame(step)
}
