import { StartNode } from "./StartNode"
import { EndNode } from "./EndNode"
import { PromptNode } from "./PromptNode"
import { ChatNode } from "./ChatNode"
import { ConditionNode } from "./ConditionNode"
import { HttpRequestNode } from "./HttpRequestNode"
import { DelayNode } from "./DelayNode"
import { RagQueryNode } from "./RagQueryNode"
import { TransformNode } from "./TransformNode"
import { SummarizeNode } from "./SummarizeNode"

export const nodeTypes = {
  START: StartNode,
  END: EndNode,
  PROMPT: PromptNode,
  CHAT: ChatNode,
  CONDITION: ConditionNode,
  HTTP_REQUEST: HttpRequestNode,
  DELAY: DelayNode,
  RAG_QUERY: RagQueryNode,
  TRANSFORM: TransformNode,
  SUMMARIZE: SummarizeNode,
}
