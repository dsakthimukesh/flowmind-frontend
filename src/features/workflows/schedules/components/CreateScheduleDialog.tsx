import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CalendarRange, AlertCircle } from "lucide-react"
import { useCreateSchedule } from "../hooks/useCreateSchedule"
import { CronBuilder } from "./CronBuilder"
import { TimezoneSelector } from "./TimezoneSelector"
import { type WorkflowSchedule } from "../types/schedule.types"
import { isValidCron } from "cron-validator"

interface CreateScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  existingSchedules: WorkflowSchedule[]
}

export const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = ({
  open,
  onOpenChange,
  workflowId,
  existingSchedules,
}) => {
  const [cronExpression, setCronExpression] = useState<string>("0 0 * * *")
  const [timezone, setTimezone] = useState<string>("UTC")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate: create, isPending } = useCreateSchedule(workflowId, () => {
    onOpenChange(false)
  })

  // Reset fields when dialog is opened
  useEffect(() => {
    if (open) {
      setCronExpression("0 0 * * *")
      setTimezone("UTC")
      setErrorMessage(null)
    }
  }, [open])

  // Validate changes for duplicates or incorrect formats
  useEffect(() => {
    if (!open) return

    // 1. Validate Cron Format
    const valid = isValidCron(cronExpression, { seconds: false, alias: true })
    if (!valid) {
      setErrorMessage("Please enter a valid 5-field cron expression.")
      return
    }

    // 2. Prevent Duplicate Schedules
    const isDuplicate = existingSchedules.some(
      (s) => s.cronExpression.trim() === cronExpression.trim() && s.timezone === timezone
    )
    if (isDuplicate) {
      setErrorMessage("A schedule with this exact frequency and timezone already exists.")
      return
    }

    setErrorMessage(null)
  }, [cronExpression, timezone, existingSchedules, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (errorMessage) return
    create({ cronExpression, timezone })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <CalendarRange className="h-5 w-5 text-primary" /> Create Execution Schedule
          </DialogTitle>
          <DialogDescription className="pt-2">
            Configure a recurring schedule to trigger automated executions of this workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 my-2">
          {/* Cron frequency selection fields */}
          <CronBuilder value={cronExpression} onChange={setCronExpression} />

          {/* Timezone selection field */}
          <TimezoneSelector value={timezone} onChange={setTimezone} />

          {/* Dialog validation warnings */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-xs text-destructive flex items-start gap-2 select-none">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/60">
            <Button
              id="schedule-create-cancel"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              id="schedule-create-confirm"
              type="submit"
              disabled={isPending || !!errorMessage}
              className="text-xs"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
