import { type BuilderNode } from "../../types/builder.types"
import { type ValidationError } from "../types/validation.types"

export const validateEndNode = (
  nodes: BuilderNode[]
): ValidationError[] => {
  const endNodes = nodes.filter((n) => n.type === "END")
  const errors: ValidationError[] = []

  if (endNodes.length === 0) {
    errors.push({
      id: "rule-end-missing",
      type: "global",
      message: "Workflow must contain at least one End node.",
      rule: "At least one End node",
    })
  }

  return errors
}
