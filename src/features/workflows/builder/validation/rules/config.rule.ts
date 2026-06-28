import { type BuilderNode } from "../../types/builder.types"
import { type ValidationError } from "../types/validation.types"
import { promptNodeSchema } from "../../config/schemas/prompt.schema"
import { chatNodeSchema } from "../../config/schemas/chat.schema"
import { conditionNodeSchema } from "../../config/schemas/condition.schema"
import { httpNodeSchema } from "../../config/schemas/http.schema"
import { delayNodeSchema } from "../../config/schemas/delay.schema"
import { ragQueryNodeSchema } from "../../config/schemas/rag.schema"
import { transformNodeSchema } from "../../config/schemas/transform.schema"
import { summarizeNodeSchema } from "../../config/schemas/summarize.schema"

export const validateConfig = (
  nodes: BuilderNode[]
): ValidationError[] => {
  const errors: ValidationError[] = []

  nodes.forEach((node) => {
    const { type, id, data } = node
    const config = data?.config
    const upperType = type?.toUpperCase()

    if (upperType === "START" || upperType === "END") {
      return
    }

    let schema: any = null

    switch (upperType) {
      case "PROMPT":
        schema = promptNodeSchema
        break
      case "CHAT":
        schema = chatNodeSchema
        break
      case "CONDITION":
        schema = conditionNodeSchema
        break
      case "HTTP_REQUEST":
        schema = httpNodeSchema
        break
      case "DELAY":
        schema = delayNodeSchema
        break
      case "RAG_QUERY":
        schema = ragQueryNodeSchema
        break
      case "TRANSFORM":
        schema = transformNodeSchema
        break
      case "SUMMARIZE":
        schema = summarizeNodeSchema
        break
      default:
        // Unknown node type or no schema associated
        return
    }

    if (!schema) {
      return
    }

    if (!config) {
      errors.push({
        id: `rule-config-missing-${id}`,
        type: "node",
        nodeId: id,
        message: `'${data?.label || type}' requires configuration.`,
        rule: "Configuration validation",
      })
      return
    }

    const result = schema.safeParse(config)
    if (!result.success) {
      const issues = result.error?.issues || result.error?.errors || []
      issues.forEach((err: any) => {
        errors.push({
          id: `rule-config-${id}-${err.path.join(".")}`,
          type: "node",
          nodeId: id,
          message: `'${data?.label || type}': ${err.message}`,
          rule: "Configuration validation",
        })
      })
    }
  })

  return errors
}
