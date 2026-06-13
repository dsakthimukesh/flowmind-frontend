import { promptNodeSchema } from "./schemas/prompt.schema"
import { chatNodeSchema } from "./schemas/chat.schema"
import { conditionNodeSchema } from "./schemas/condition.schema"
import { httpNodeSchema } from "./schemas/http.schema"
import { delayNodeSchema } from "./schemas/delay.schema"
import { ragQueryNodeSchema } from "./schemas/rag.schema"
import { transformNodeSchema } from "./schemas/transform.schema"
import { summarizeNodeSchema } from "./schemas/summarize.schema"

export const isNodeConfigured = (type: string, config: any): boolean => {
  if (!config) return false

  switch (type) {
    case "START":
    case "END":
      return true // Start/End nodes have no additional config required in this phase
    case "PROMPT":
      return promptNodeSchema.safeParse(config).success
    case "CHAT":
      return chatNodeSchema.safeParse(config).success
    case "CONDITION":
      return conditionNodeSchema.safeParse(config).success
    case "HTTP_REQUEST":
      return httpNodeSchema.safeParse(config).success
    case "DELAY":
      return delayNodeSchema.safeParse(config).success
    case "RAG_QUERY":
      return ragQueryNodeSchema.safeParse(config).success
    case "TRANSFORM":
      return transformNodeSchema.safeParse(config).success
    case "SUMMARIZE":
      return summarizeNodeSchema.safeParse(config).success
    default:
      return false
  }
}

export const hasValidationErrors = (nodes: any[]): boolean => {
  return nodes.some((node) => !isNodeConfigured(node.type, node.data?.config))
}
