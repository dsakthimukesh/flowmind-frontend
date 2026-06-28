import { type BuilderNode } from "../../types/builder.types"
import { type ValidationError } from "../types/validation.types"

export const validateStartNode = (
  nodes: BuilderNode[]
): ValidationError[] => {
  const startNodes = nodes.filter((n) => n.type?.toUpperCase() === "START")
  const errors: ValidationError[] = []

  if (startNodes.length === 0) {
    errors.push({
      id: "rule-start-missing",
      type: "global",
      message: "Workflow must contain exactly one Start node.",
      rule: "Exactly one Start node",
    })
  } else if (startNodes.length > 1) {
    startNodes.forEach((node) => {
      errors.push({
        id: `rule-start-multiple-${node.id}`,
        type: "node",
        nodeId: node.id,
        message: "Multiple Start nodes found. Exactly one is allowed.",
        rule: "Exactly one Start node",
      })
    })
  }

  return errors
}
