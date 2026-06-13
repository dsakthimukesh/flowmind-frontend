import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useDeleteSchedule } from "../hooks/useDeleteSchedule"

interface DeleteScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  scheduleId: string
}

export const DeleteScheduleDialog: React.FC<DeleteScheduleDialogProps> = ({
  open,
  onOpenChange,
  workflowId,
  scheduleId,
}) => {
  const { mutate: performDelete, isPending } = useDeleteSchedule(workflowId, () => {
    onOpenChange(false)
  })

  const handleDelete = () => {
    performDelete(scheduleId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-destructive">
            <Trash2 className="h-5 w-5" /> Delete Schedule
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this schedule? This action is permanent and will stop all future executions scheduled at this time.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            id="schedule-delete-cancel"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            id="schedule-delete-confirm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs font-bold"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
