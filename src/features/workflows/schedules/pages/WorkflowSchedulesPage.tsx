import React, { useState } from "react"
import { useParams } from "react-router"
import { Plus, CalendarDays } from "lucide-react"

import { PageContainer } from "@/components/common/PageContainer"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"

import { useWorkflow } from "../../hooks/useWorkflow"
import { useSchedules } from "../hooks/useSchedules"
import { WorkflowHeader } from "../../components/WorkflowHeader"
import { ScheduleTable } from "../components/ScheduleTable"
import { CreateScheduleDialog } from "../components/CreateScheduleDialog"
import { DeleteScheduleDialog } from "../components/DeleteScheduleDialog"
import { ScheduleSkeleton } from "../components/ScheduleSkeleton"

export const WorkflowSchedulesPage: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>()
  const id = workflowId || ""
  
  const currentRole = useAuthStore((state) => state.role)
  const canModify = currentRole === "OWNER" || currentRole === "ADMIN"

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("")

  // Fetch workflow details and schedules list
  const workflowQuery = useWorkflow(id)
  const schedulesQuery = useSchedules(id)

  const isLoading = workflowQuery.isLoading || schedulesQuery.isLoading
  const isError = workflowQuery.isError || schedulesQuery.isError

  const handleRetry = () => {
    workflowQuery.refetch()
    schedulesQuery.refetch()
  }

  const handleDeleteClick = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId)
    setDeleteOpen(true)
  }

  if (isLoading) {
    return (
      <PageContainer>
        <ScheduleSkeleton />
      </PageContainer>
    )
  }

  if (isError || !workflowQuery.data?.data) {
    return (
      <PageContainer>
        <WorkflowHeader title="Workflow Schedules" backLink={`/workflows/${id}`} />
        <ErrorState
          title="Schedules unavailable"
          message="Failed to load the schedules configuration. Please check your connection."
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  const workflow = workflowQuery.data.data
  const schedules = schedulesQuery.data?.data || []

  return (
    <PageContainer>
      <WorkflowHeader
        title={`${workflow.name} Schedules`}
        description="Schedule execution triggers to automate workflow runs."
        backLink={`/workflows/${id}`}
        backText="Back to Details"
        actions={
          canModify ? (
            <Button id="schedule-create-trigger" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Schedule
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-6">
        {/* Metric Summary Bar */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center gap-3.5 select-none">
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Schedules
              </p>
              <h3 className="text-xl font-extrabold text-foreground leading-tight">
                {schedules.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Schedules Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight">Active Execution Calendars</h2>
          </div>
          <ScheduleTable
            schedules={schedules}
            workflowId={id}
            canModify={canModify}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </div>

      {/* Create Schedule Dialog Overlay */}
      {canModify && (
        <CreateScheduleDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          workflowId={id}
          existingSchedules={schedules}
        />
      )}

      {/* Delete Confirmation Dialog Overlay */}
      {canModify && (
        <DeleteScheduleDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          workflowId={id}
          scheduleId={selectedScheduleId}
        />
      )}
    </PageContainer>
  )
}
