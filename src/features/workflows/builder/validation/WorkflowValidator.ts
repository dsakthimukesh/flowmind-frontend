import { type BuilderNode, type BuilderEdge } from "../types/builder.types"
import { type ValidationResult, type ValidationError } from "./types/validation.types"
import { validateStartNode } from "./rules/start.rule"
import { validateEndNode } from "./rules/end.rule"
import { validateConnectivity } from "./rules/connectivity.rule"
import { validateConfig } from "./rules/config.rule"
import { validateCycles } from "./rules/cycle.rule"

/**
 * Validates if there is at least one path from the START node to an END node using BFS.
 */
const validatePathStartToEnd = (
  nodes: BuilderNode[],
  edges: BuilderEdge[]
): ValidationError[] => {
  const errors: ValidationError[] = []
  const startNode = nodes.find((n) => n.type?.toUpperCase() === "START")

  if (!startNode) {
    // No start node to traverse from (handled by validateStartNode)
    return errors
  }

  // Build adjacency list for forward traversal
  const adjList: Record<string, string[]> = {}
  nodes.forEach((n) => {
    adjList[n.id] = []
  })

  edges.forEach((e) => {
    if (adjList[e.source]) {
      adjList[e.source].push(e.target)
    }
  })

  // Perform Breadth-First Search (BFS) to find reachability to any END node
  const queue: string[] = [startNode.id]
  const visited = new Set<string>([startNode.id])
  let endReached = false

  while (queue.length > 0) {
    const currentId = queue.shift()!
    const currentNode = nodes.find((n) => n.id === currentId)

    if (currentNode?.type?.toUpperCase() === "END") {
      endReached = true
      break
    }

    const neighbors = adjList[currentId] || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  if (!endReached) {
    errors.push({
      id: "rule-path-start-to-end",
      type: "global",
      message: "No valid path exists from the Start node to any End node.",
      rule: "Path existence",
    })
  }

  return errors
}

/**
 * The main Workflow Validator coordinator function.
 * Runs all validation rules and returns a compiled ValidationResult.
 */
export const validateWorkflow = (
  nodes: BuilderNode[],
  edges: BuilderEdge[]
): ValidationResult => {
  const errors: ValidationError[] = []

  // Rule 1: Exactly one START node
  errors.push(...validateStartNode(nodes))

  // Rule 2: At least one END node
  errors.push(...validateEndNode(nodes))

  // Rule 3: Connectivity checks (isolated nodes, missing inputs/outputs)
  errors.push(...validateConnectivity(nodes, edges))

  // Rule 4: Config Zod validation
  errors.push(...validateConfig(nodes))

  // Rule 5: Cycle detection
  errors.push(...validateCycles(nodes, edges))

  // Rule 6: Path existence (Start -> End)
  // Only execute path check if we have exactly one START node and at least one END node
  // to avoid redundant errors when basic structure is invalid.
  const hasOneStart = nodes.filter((n) => n.type?.toUpperCase() === "START").length === 1
  const hasAtLeastOneEnd = nodes.filter((n) => n.type?.toUpperCase() === "END").length >= 1
  if (hasOneStart && hasAtLeastOneEnd) {
    errors.push(...validatePathStartToEnd(nodes, edges))
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  }
}
