import { useState } from "react"
import { useParams, Link } from "react-router"
import { Plus, Loader2, GitCommit } from "lucide-react"

import { PageContainer } from "@/components/common/PageContainer"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuthStore } from "@/stores/authStore"

import { useWorkflow } from "../hooks/useWorkflow"
import { useWorkflowVersions } from "../hooks/useWorkflowVersions"
import { useCreateWorkflowVersion } from "../hooks/useCreateWorkflowVersion"
import { WorkflowCard } from "../components/WorkflowCard"
import { WorkflowHeader } from "../components/WorkflowHeader"
import { VersionHistoryTable } from "../components/VersionHistoryTable"
import { PublishVersionDialog } from "../components/PublishVersionDialog"
import { WorkflowSkeleton } from "../components/WorkflowSkeleton"
import { type WorkflowVersion } from "../types/workflow.types"

export const WorkflowDetailPage = () => {
  const { workflowId } = useParams<{ workflowId: string }>()
  const currentRole = useAuthStore((state) => state.role)
  
  const [createVersionOpen, setCreateVersionOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersion | null>(null)

  const id = workflowId || ""

  const workflowQuery = useWorkflow(id)
  const versionsQuery = useWorkflowVersions(id)

  const { mutate: createVersion, isPending: isCreatingVersion } = useCreateWorkflowVersion(id, () => {
    setCreateVersionOpen(false)
  })

  const isLoading = workflowQuery.isLoading || versionsQuery.isLoading
  const isError = workflowQuery.isError || versionsQuery.isError

  const handleRetry = () => {
    workflowQuery.refetch()
    versionsQuery.refetch()
  }

  // RBAC checks for creating versions and publishing (OWNER/ADMIN only)
  const canModifyVersions = currentRole === "OWNER" || currentRole === "ADMIN"

  if (isLoading) {
    return <WorkflowSkeleton />
  }

  if (isError || !workflowQuery.data?.data) {
    return (
      <PageContainer>
        <WorkflowHeader title="Workflow Details" backLink="/workflows" />
        <ErrorState
          title="Workflow details unavailable"
          message="Failed to load the requested workflow information. Please verify your connection."
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  const workflow = workflowQuery.data.data
  const versions = versionsQuery.data?.data || []

  const handleCreateVersionConfirm = () => {
    // Submit standard empty nodes and edges definition
    createVersion({
      nodes: [],
      edges: [],
    })
  }

  const handlePublishClick = (version: WorkflowVersion) => {
    setSelectedVersion(version)
    setPublishOpen(true)
  }

  return (
    <PageContainer>
      <WorkflowHeader
        title={workflow.name}
        description="View metadata and release version history."
        backLink="/workflows"
        backText="Back to Workflows"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link id="open-schedules-trigger" to={`/workflows/${id}/schedules`}>
                Schedules
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link id="open-builder-trigger" to={`/workflows/${id}/builder`}>
                Open Builder
              </Link>
            </Button>
            {canModifyVersions && (
              <Button
                id="create-version-trigger"
                onClick={() => setCreateVersionOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Version
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Workflow info card */}
        <div className="md:col-span-1">
          <WorkflowCard workflow={workflow} />
        </div>

        {/* Versions Table */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Version Releases</h2>
          </div>
          <VersionHistoryTable
            versions={versions}
            workflowId={id}
            currentRole={currentRole}
            onPublishClick={handlePublishClick}
          />
        </div>
      </div>

      {/* Create Version Dialog */}
      {canModifyVersions && (
        <Dialog open={createVersionOpen} onOpenChange={setCreateVersionOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <GitCommit className="h-5 w-5 text-primary" /> Create New Version Draft
              </DialogTitle>
              <DialogDescription className="pt-2">
                This will lock your current builder definition and create a new version release draft.
                For now, a minimal builder state containing empty nodes and edges will be initialized.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                id="create-version-cancel"
                variant="outline"
                onClick={() => setCreateVersionOpen(false)}
                disabled={isCreatingVersion}
              >
                Cancel
              </Button>
              <Button
                id="create-version-confirm"
                onClick={handleCreateVersionConfirm}
                disabled={isCreatingVersion}
              >
                {isCreatingVersion && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Publish Version Dialog */}
      {canModifyVersions && (
        <PublishVersionDialog
          open={publishOpen}
          onOpenChange={setPublishOpen}
          version={selectedVersion}
          workflowId={id}
        />
      )}
    </PageContainer>
  )
}
