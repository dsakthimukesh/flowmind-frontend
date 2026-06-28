import { useEffect } from "react"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { validateWorkflow } from "../WorkflowValidator"

export const useWorkflowValidation = () => {
  const nodes = useWorkflowBuilderStore((state) => state.nodes)
  const edges = useWorkflowBuilderStore((state) => state.edges)
  const setValidationResult = useWorkflowBuilderStore((state) => state.setValidationResult)

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("🔍 VALIDATOR NODES STATE:", nodes.map((n) => ({ id: n.id, type: n.type, label: n.data?.label || n.name })))
      console.log("🔍 VALIDATOR EDGES STATE:", edges.map((e) => ({ id: e.id, source: e.source, target: e.target })))
      const result = validateWorkflow(nodes, edges)
      setValidationResult(result)
    }, 300)

    return () => clearTimeout(timer)
  }, [nodes, edges, setValidationResult])
}
