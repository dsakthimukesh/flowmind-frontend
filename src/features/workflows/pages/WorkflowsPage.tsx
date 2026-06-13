import { useState } from "react"
import { Plus } from "lucide-react"

import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"

import { useWorkflows } from "../hooks/useWorkflows"
import { WorkflowTable } from "../components/WorkflowTable"
import { CreateWorkflowDialog } from "../components/CreateWorkflowDialog"
import { WorkflowSkeleton } from "../components/WorkflowSkeleton"

export const WorkflowsPage = () => {
  const currentRole = useAuthStore((state) => state.role)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useWorkflows()

  // RBAC check: OWNER, ADMIN, MEMBER can create workflows
  const canCreate = currentRole === "OWNER" || currentRole === "ADMIN" || currentRole === "MEMBER"

  if (isLoading) {
    return <WorkflowSkeleton />
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Workflows" description="Manage and orchestrate your AI automated workflows." />
        <ErrorState
          title="Failed to load workflows"
          message="There was an error communicating with the backend. Please try again."
          onRetry={refetch}
        />
      </PageContainer>
    )
  }

  const workflows = data?.data || []

  return (
    <PageContainer>
      <PageHeader
        title="Workflows"
        description="Manage and orchestrate your AI automated workflows."
        actions={
          canCreate && (
            <Button id="create-workflow-trigger" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Workflow
            </Button>
          )
        }
      />

      <div className="space-y-4">
        <WorkflowTable workflows={workflows} />
      </div>

      {canCreate && (
        <CreateWorkflowDialog open={createOpen} onOpenChange={setCreateOpen} />
      )}
    </PageContainer>
  )
}
