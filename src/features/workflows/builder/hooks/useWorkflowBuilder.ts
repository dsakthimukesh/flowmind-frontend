import { useEffect } from "react"
import { useWorkflow } from "../../hooks/useWorkflow"
import { useWorkflowVersions } from "../../hooks/useWorkflowVersions"
import { useWorkflowVersion } from "../../hooks/useWorkflowVersion"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

export const useWorkflowBuilder = (workflowId: string, versionId?: string) => {
  const workflowQuery = useWorkflow(workflowId)
  const versionsQuery = useWorkflowVersions(workflowId)

  // Resolve the latest version if no specific versionId is given
  const versions = versionsQuery.data?.data || []
  
  // Sort versions by versionNumber descending to get latest
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber)
  const latestVersionId = sortedVersions[0]?.id || ""
  
  const resolvedVersionId = versionId || latestVersionId

  const versionQuery = useWorkflowVersion(workflowId, resolvedVersionId)
  
  const setNodes = useWorkflowBuilderStore((state) => state.setNodes)
  const setEdges = useWorkflowBuilderStore((state) => state.setEdges)
  const reset = useWorkflowBuilderStore((state) => state.reset)

  // Sync React Flow state on load
  useEffect(() => {
    if (versionQuery.data?.data?.definition) {
      const { nodes = [], edges = [] } = versionQuery.data.data.definition
      setNodes(nodes)
      setEdges(edges)
    } else {
      setNodes([])
      setEdges([])
    }
  }, [versionQuery.data, setNodes, setEdges])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  return {
    workflow: workflowQuery.data?.data,
    version: versionQuery.data?.data,
    isLoading:
      workflowQuery.isLoading ||
      versionsQuery.isLoading ||
      (!!resolvedVersionId && versionQuery.isLoading),
    isError:
      workflowQuery.isError ||
      versionsQuery.isError ||
      (!!resolvedVersionId && versionQuery.isError),
    refetch: () => {
      workflowQuery.refetch()
      versionsQuery.refetch()
      if (resolvedVersionId) {
        versionQuery.refetch()
      }
    },
  }
}
