import { type BuilderNode, type BuilderEdge } from "../../types/builder.types"
import { type ValidationError } from "../types/validation.types"

export const validateCycles = (
  nodes: BuilderNode[],
  edges: BuilderEdge[]
): ValidationError[] => {
  const errors: ValidationError[] = []
  const adjList: Record<string, string[]> = {}

  // Initialize adjacency list for all nodes
  nodes.forEach((n) => {
    adjList[n.id] = []
  })

  // Populate adjacency list
  edges.forEach((e) => {
    if (adjList[e.source]) {
      adjList[e.source].push(e.target)
    }
  })

  const visited: Record<string, boolean> = {}
  const recStack: Record<string, boolean> = {}
  const cycleNodes = new Set<string>()

  // Helper DFS function to detect cycles
  const dfs = (nodeId: string, path: string[]): boolean => {
    visited[nodeId] = true
    recStack[nodeId] = true
    path.push(nodeId)

    const neighbors = adjList[nodeId] || []
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        if (dfs(neighbor, path)) {
          return true
        }
      } else if (recStack[neighbor]) {
        // Cycle detected! All nodes in the path from the neighbor onwards are part of the cycle
        const startIndex = path.indexOf(neighbor)
        if (startIndex !== -1) {
          const cyclePath = path.slice(startIndex)
          cyclePath.forEach((id) => cycleNodes.add(id))
        }
        return true
      }
    }

    recStack[nodeId] = false
    path.pop()
    return false
  }

  // Run DFS starting from each unvisited node
  nodes.forEach((node) => {
    if (!visited[node.id]) {
      dfs(node.id, [])
    }
  })

  // Add errors for each node involved in the cycle
  cycleNodes.forEach((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId)
    const label = node?.data?.label || nodeId
    errors.push({
      id: `rule-cycle-${nodeId}`,
      type: "node",
      nodeId: nodeId,
      message: `Cycle detected: Node '${label}' is part of an invalid infinite loop.`,
      rule: "Cycle detection",
    })
  })

  return errors
}
