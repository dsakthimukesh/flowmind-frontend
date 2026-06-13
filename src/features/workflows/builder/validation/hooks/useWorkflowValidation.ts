import { useEffect } from "react"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { validateWorkflow } from "../WorkflowValidator"

export const useWorkflowValidation = () => {
  const nodes = useWorkflowBuilderStore((state) => state.nodes)
  const edges = useWorkflowBuilderStore((state) => state.edges)
  const setValidationResult = useWorkflowBuilderStore((state) => state.setValidationResult)

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = validateWorkflow(nodes, edges)
      setValidationResult(result)
    }, 300)

    return () => clearTimeout(timer)
  }, [nodes, edges, setValidationResult])
}
