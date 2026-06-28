import { type BuilderNode, type BuilderEdge } from "../../types/builder.types"
import { type ValidationError } from "../types/validation.types"

export const validateConnectivity = (
  nodes: BuilderNode[],
  edges: BuilderEdge[]
): ValidationError[] => {
  const errors: ValidationError[] = []

  nodes.forEach((node) => {
    const incoming = edges.filter((e) => e.target === node.id)
    const outgoing = edges.filter((e) => e.source === node.id)

    if (node.type?.toUpperCase() === "START") {
      if (nodes.length > 1 && outgoing.length === 0) {
        errors.push({
          id: `rule-connectivity-${node.id}`,
          type: "node",
          nodeId: node.id,
          message: "Start node must have at least one outgoing connection.",
          rule: "All nodes connected",
        })
      }
    } else if (node.type?.toUpperCase() === "END") {
      if (incoming.length === 0) {
        errors.push({
          id: `rule-connectivity-${node.id}`,
          type: "node",
          nodeId: node.id,
          message: "End node must have at least one incoming connection.",
          rule: "All nodes connected",
        })
      }
    } else {
      // General logic nodes connectivity checks
      if (incoming.length === 0 && outgoing.length === 0) {
        errors.push({
          id: `rule-connectivity-isolated-${node.id}`,
          type: "node",
          nodeId: node.id,
          message: `Floating node: '${node.data.label}' has no canvas connections.`,
          rule: "All nodes connected",
        })
      } else if (incoming.length === 0) {
        errors.push({
          id: `rule-connectivity-no-incoming-${node.id}`,
          type: "node",
          nodeId: node.id,
          message: `'${node.data.label}' has no incoming connections and cannot be reached.`,
          rule: "All nodes connected",
        })
      } else if (outgoing.length === 0) {
        errors.push({
          id: `rule-connectivity-no-outgoing-${node.id}`,
          type: "node",
          nodeId: node.id,
          message: `'${node.data.label}' has no outgoing connections and blocks progression.`,
          rule: "All nodes connected",
        })
      }
    }
  })

  return errors
}
